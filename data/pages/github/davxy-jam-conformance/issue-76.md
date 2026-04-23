---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/76'
title: PVM FFI-able library for JAM Implementers
site: github.com/davxy/jam-conformance
created_at: '2025-09-12T17:17:56.000Z'
last_modified: '2025-09-12T17:17:56.000Z'
content_kind: issue
---

# PVM FFI-able library for JAM Implementers

## Issue by @sourabhniyogi

JAM Implementations in lower performance languages (Python/Typescript/...) can more effectively compete with a PVM FFI written in a higher performance language (C/C++/Rust).  [Initial performance data](https://paritytech.github.io/jam-conformance-dashboard/) makes the performance difference between lower performance languages obvious, motivating a **PVM FFI-able library for JAM Implementers**.

The [JAM prize](https://jam.web3.foundation/) already contemplates 2+ paths, which may use such a library:
* Validating Node Path: Teams  targeting M3/M4 may publish a PVM FFI library exposing their recompiler/interpreter for teams on the _Non-PVM Validating Node Path_ (below)  to use.
* Non-PVM Validating Node Path: Teams not targeting M3/M4 may use the above library to make the PVM execution work an order of magnitude faster: With refine and accumulation expected to support 3.5-5B gas in under a few seconds, teams on _Non-PVM Validating Node Path_, rather being 3-100x slower, would then be expected to be 1-3x, extending to fuzz audit times being reduced by the same factor.  

Below is a code-complete `pvm.h` outlining a library for the above two types of teams to publish vs use on 2 different paths.   Critically, the PVM API contains registration of a host function callback supporting the key `ecalli` PVM instruction, which would interface to the host functions.   Note that both a high-performance PVM interpreter (for Mac/X86) *and* a high-performance recompiler (for X86 only at first, but not necessarily only later) can conform to the same API.   

The source code for the underlying PVM library can be made open-source upon request by teams on the "Non-PVM Validating Node Path" of the "Validating Node Path", though this may naturally preclude the "Non-PVM Validating Node Path" team from pursuing the "Validating Node Path" later.  The key idea is that the PVM interpreters are merely _temporary scaffolding_ for a recompiler anyway, and in our early M1 largely educational: Teams will use this interpreter as a source of ground truth (hopefully accurate!) for their recompiler.  We would hope that teams on the _Non-PVM Validating Node Path_ using an PVM library of teams on the _Validating Node Path_ would report PVM-related bugs in the course of PVM fuzzing.

Alternatively, instead of source code being made available, a "libpvm.a" form of the library (for Mac/Linux) could continue to support present M1/M2 clean room requirements. 

```
#ifndef PVM_H
#define PVM_H

#include <stdint.h>
#include <limits.h>
#include <stdio.h>
#include <string.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

// ===============================
// VM Structure and Constants
// ===============================

#define REG_SIZE 13
#define Z_P (1 << 12)  // Page size constant
#define Z_A 2          // Alignment constant
#define OK 0           // Success code
#define OOB ((uint64_t)((1ULL << 32) - 3))  // Out of bounds error

// PVM-specific constants
#define W_X 1024
#define M 128
#define V 1023
#define Z_Q (1 << 16)
#define Z_I (1 << 24)
#define Z_Z (1 << 16)

// Result codes
#define NONE ((uint64_t)((1ULL << 32) - 1))
#define WHAT ((uint64_t)((1ULL << 32) - 2))
#define OOB  ((uint64_t)((1ULL << 32) - 3))
#define WHO  ((uint64_t)((1ULL << 32) - 4))
#define FULL ((uint64_t)((1ULL << 32) - 5))
#define CORE ((uint64_t)((1ULL << 32) - 6))
#define CASH ((uint64_t)((1ULL << 32) - 7))
#define LOW  ((uint64_t)((1ULL << 32) - 8))
#define HUH  ((uint64_t)((1ULL << 32) - 9))

// Machine states
#define HALT  0
#define PANIC 1
#define FAULT 2
#define HOST  3
#define OOG   4

// Work digest codes 
#define WORKDIGEST_OK         0
#define WORKDIGEST_OOG        1
#define WORKDIGEST_PANIC      2
#define WORKDIGEST_BAD_EXPORT 3
#define WORKDIGEST_OVERSIZE   4
#define WORKDIGEST_BAD        5
#define WORKDIGEST_BIG        6

// FFI Result codes
typedef enum {
    PVM_RESULT_OK = 0,
    PVM_RESULT_OOG = 1,
    PVM_RESULT_PANIC = 2,
    PVM_RESULT_HOST_CALL = 3,
    PVM_RESULT_ERROR = 4
} pvm_result_t;

// Host function callback result codes
typedef enum {
    PVM_HOST_CONTINUE = 0,
    PVM_HOST_TERMINATE = 1,
    PVM_HOST_ERROR = 2
} pvm_host_result_t;

// VM structure forward declaration
typedef struct VM VM;

// Direct typedef to VM for FFI performance
typedef VM pvm_vm_t;

// Host function callback signature
typedef pvm_host_result_t (*pvm_host_callback_t)(
    pvm_vm_t* vm,           // VM handle for state access
    int func_id             // Host function ID
);

struct VM {
    uint64_t registers[REG_SIZE];
    uint64_t pc;
    uint8_t* code;
    uint8_t* bitmask;
    uint64_t gas;
    int host_call;
    int host_func_id;
    int is_child;
    
    // Memory regions
    uint8_t* rw_data;
    uint8_t* ro_data;
    uint8_t* output;
    uint8_t* stack;
    uint32_t rw_data_address;
    uint32_t rw_data_address_end;
    uint32_t ro_data_address;
    uint32_t ro_data_address_end;
    uint32_t output_address;
    uint32_t output_end;
    uint32_t stack_address;
    uint32_t stack_address_end;
    uint32_t current_heap_pointer;
    uint32_t max_heapsize;

    // Code and data segments
    uint32_t code_len;
    uint32_t bitmask_len;
    
    // VM state
    int result_code;
    int machine_state;
    int terminated;
    int initializing;
    uint32_t fault_address;
    uint32_t j_size;
    uint32_t* j;
    uint32_t service_index;
    uint32_t core_index;
    
    uint8_t* ext_vm;            // Pointer to External VM (for FFI linkage)

    // Callback function pointer for host calls
    void (*ext_invoke_host_func)(struct VM* vm, int host_func_id);
    
    // FFI host callback support
    void* host_callback;            // FFI host callback function pointer
    
    // Logging and tracing attributes
    int pvm_logging;                // Enable/disable logging for this VM instance
    int pvm_tracing;                // Enable/disable tracing for this VM instance
};

// ===============================
// VM Lifecycle (FFI API)
// ===============================

// Create a new VM instance with simplified interface

pvm_vm_t* pvm_create(uint32_t service_index, 
                        const uint8_t* code, size_t code_len,
                        const uint64_t* initial_regs,
                        const uint8_t* bitmask, size_t bitmask_len,
                        const uint32_t* jump_table, size_t jump_table_len,
                        uint64_t initial_gas);
// Execute VM starting at entry point
pvm_result_t pvm_execute(pvm_vm_t* vm, uint32_t entry_point, uint32_t is_child);

// Destroy VM instance and free resources
void pvm_destroy(pvm_vm_t* vm);

// Set memory region bounds for validation
void pvm_set_memory_bounds(pvm_vm_t* vm,
    uint32_t rw_addr, uint32_t rw_end,
    uint32_t ro_addr, uint32_t ro_end,
    uint32_t output_addr, uint32_t output_end,
    uint32_t stack_addr, uint32_t stack_end);

// Set host function callback
void pvm_set_host_callback(pvm_vm_t* vm, pvm_host_callback_t callback);

// Get current gas amount
uint64_t pvm_get_gas(pvm_vm_t* vm);

// Get machine state
uint8_t pvm_get_machine_state(pvm_vm_t* vm);

// Set register value
void pvm_set_register(pvm_vm_t* vm, int index, uint64_t value);

// Get register value
uint64_t pvm_get_register(pvm_vm_t* vm, int index);

// Get pointer to registers array (for direct access)
const uint64_t* pvm_get_registers(pvm_vm_t* vm);

// Set heap pointer
void pvm_set_heap_pointer(pvm_vm_t* vm, uint32_t pointer);

// ===============================
// Memory Operations (FFI API)
// ===============================

// Write operations (return error code: 0 = OK, non-zero = error)
uint64_t pvm_write_ram_bytes_8(pvm_vm_t* vm, uint32_t address, uint8_t data);
uint64_t pvm_write_ram_bytes_16(pvm_vm_t* vm, uint32_t address, uint16_t data);
uint64_t pvm_write_ram_bytes_32(pvm_vm_t* vm, uint32_t address, uint32_t data);
uint64_t pvm_write_ram_bytes_64(pvm_vm_t* vm, uint32_t address, uint64_t data);
uint64_t pvm_write_ram_bytes(pvm_vm_t* vm, uint32_t address, const uint8_t* data, uint32_t length);

// Read operations (error_code pointer can be NULL if not needed)
uint8_t pvm_read_ram_bytes_8(pvm_vm_t* vm, uint32_t address, int* error_code);
uint16_t pvm_read_ram_bytes_16(pvm_vm_t* vm, uint32_t address, int* error_code);
uint32_t pvm_read_ram_bytes_32(pvm_vm_t* vm, uint32_t address, int* error_code);
uint64_t pvm_read_ram_bytes_64(pvm_vm_t* vm, uint32_t address, int* error_code);
uint64_t pvm_read_ram_bytes(pvm_vm_t* vm, uint32_t address, uint8_t* buffer, uint32_t length, int* error_code);

// Get result code
int pvm_get_result_code(pvm_vm_t* vm);

// Check if VM is terminated
int pvm_is_terminated(pvm_vm_t* vm);

// ===============================
// Debug and Tracing (FFI API)
// ===============================

// Set logging and tracing for this VM instance
void pvm_set_logging(pvm_vm_t* vm, int enable);
void pvm_set_tracing(pvm_vm_t* vm, int enable);

// VM Core functions (private, not intended for FFI)
const char* reg_name(int index);

void pvm_expand_heap(pvm_vm_t* vm, uint32_t new_size);
void pvm_panic(VM* vm, uint64_t err_code);
extern void (*dispatch_table[256])(VM*, uint8_t*, size_t);
void init_dispatch_table(void);
const char* get_opcode_name(uint8_t opcode);
void pvm_branch(VM* vm, uint64_t vx);
void pvm_djump(VM* vm, uint64_t a);

uint32_t p_func(uint32_t x);
uint32_t z_func(uint32_t x);

#ifdef __cplusplus
}
#endif

#endif // PVM_H
```


## Comment by @davxy

I'm not sure if this is the right place for this discussion :-)
