---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/737'
title: 'Refactor AnanasInterpreter: Move initialization logic to constructor'
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-25T13:46:15.000Z'
last_modified: '2025-10-25T13:46:15.000Z'
content_kind: issue
---

# Refactor AnanasInterpreter: Move initialization logic to constructor

## Issue by @coderabbitai[bot]

## Context

As discussed in PR #716, if `AnanasInterpreter` instances are meant to be used once, the initialization logic (currently in `resetJam()`) should be moved to the constructor for better design.

## Original Feedback

> If instances are meant to be used once, it would be best if this was part of the constructor instead.
>
> — @tomusdrw

## File

`packages/core/pvm-interpreter-ananas/index.ts`

## Related Links

- PR: https://github.com/FluffyLabs/typeberry/pull/716
- Comment: https://github.com/FluffyLabs/typeberry/pull/716#discussion_r2448609400

## Requested by

@DrEverr


## Comment by @tomusdrw

@coderabbitai is this still valid? Can you propose a PR


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated reply by CodeRabbit -->
## Coding Plan

### Summary

- Introduce discriminated union types to represent different initialization modes (JAM/Generic)
- Extend the private constructor to accept optional initialization parameters and perform initialization inline
- Add two new factory methods (`newJam`, `newGeneric`) that provide single-step creation and initialization
- Deprecate the existing `new()` factory via JSDoc while preserving backward compatibility

<details>
<summary><b>Design Choices</b></summary>

<details>
<summary><b>Design Choice 1: Should both `resetJam()` and `resetGeneric()` initialization be supported at construction time?</b></summary>



**Options Considered:**
1. Handle only `resetJam()` initialization at construction
2. Handle both `resetJam()` and `resetGeneric()` initialization for consistency

**Chosen Option:** 2

**Rationale:** Both reset methods should have corresponding factory methods for API consistency and completeness.

</details>

<details>
<summary><b>Design Choice 2: Should the existing `new()` factory be removed or retained?</b></summary>



**Options Considered:**
1. Remove `new()` entirely, forcing callers to use new factories
2. Keep `new()` unchanged for backward compatibility
3. Keep `new()` and mark as deprecated with JSDoc

**Chosen Option:** 3

**Rationale:** Retain and deprecate the existing factory to maintain backward compatibility while signaling the preferred pattern.

</details>

<details>
<summary><b>Design Choice 3: What should happen if `resetJam()`/`resetGeneric()` is called on an already-initialized instance?</b></summary>



**Options Considered:**
1. Allow re-initialization (preserve current behavior)
2. Throw an error to enforce single-use
3. No-op to silently prevent re-initialization

**Chosen Option:** 1

**Rationale:** Allow re-initialization to maintain interface compliance and backward compatibility. Single-use semantics are enforced by convention, not by runtime errors.

</details>

</details>

<b>💡 User Tips</b>

Regenerate the plan with different choices with `@coderabbitai <feedback>`.


## Implementation Steps


### Refactor AnanasInterpreter Constructor and Factories

This phase modifies the `AnanasInterpreter` class to accept initialization parameters at construction time and provides new factory methods that create ready-to-run interpreter instances.


<details>
<summary><b>Task 1: Define Initialization Parameter Types</b></summary>

Define discriminated union types to represent the different initialization modes (JAM vs Generic) that can be passed to the constructor.

- Add a type definition in `packages/core/pvm-interpreter-ananas/index.ts` for JAM initialization params (program, args, pc, gas)
- Add a type definition for Generic initialization params (rawProgram, pc, gas)
- Create a discriminated union type combining both with a `type` discriminant field

</details>


<details>
<summary><b>Task 2: Modify Constructor to Accept Initialization Parameters</b></summary>

Extend the private constructor to optionally accept initialization parameters and perform initialization during construction.

- Update the constructor signature in `packages/core/pvm-interpreter-ananas/index.ts` to accept an optional initialization params argument
- Add conditional logic in the constructor body that calls the appropriate internal reset logic based on the params type discriminant
- Ensure the existing behavior (no initialization) is preserved when params are omitted

</details>


<details>
<summary><b>Task 3: Add New Factory Methods</b></summary>

Create new async factory methods that instantiate the interpreter with initialization in a single step.

- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number, gas: Gas)` factory that creates an instance and passes JAM init params to constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` factory that creates an instance and passes Generic init params to constructor
- Both factories should follow the same WASM instantiation pattern as the existing `new()` factory

</details>


<details>
<summary><b>Task 4: Deprecate Existing Factory</b></summary>

Mark the existing `new()` factory as deprecated while preserving its functionality.

- Add JSDoc `@deprecated` annotation to the existing `static async new()` method in `packages/core/pvm-interpreter-ananas/index.ts`
- Include a message directing users to `newJam()` or `newGeneric()` as the preferred alternatives
- Do not modify the implementation—it should continue working for backward compatibility

</details>


<details>
<summary><b>🤖 Prompt for AI agents</b></summary>

```
Refactor the `AnanasInterpreter` class in
`packages/core/pvm-interpreter-ananas/index.ts` to support initialization
parameters at construction time and expose new single-step factory methods.

**Task 1: Define Initialization Parameter Types**
- Add a type for JAM initialization params with fields: `program: Uint8Array`,
`args: Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g.,
`type: 'jam'`)
- Add a type for Generic initialization params with fields: `rawProgram:
Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g., `type:
'generic'`)
- Create a discriminated union type combining both param types using the `type`
field

**Task 2: Modify the Private Constructor**
- Update the private constructor signature to accept an optional argument of the
discriminated union type
- In the constructor body, add conditional logic that checks the `type`
discriminant and calls the appropriate internal reset logic (`resetJam` or
`resetGeneric` internals) when params are provided
- When no params are provided, preserve the existing behavior (no
initialization)

**Task 3: Add New Factory Methods**
- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number,
gas: Gas)` — instantiate the interpreter (following the same WASM instantiation
pattern as the existing `new()` factory) and pass JAM init params to the
constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` —
instantiate the interpreter (same WASM pattern) and pass Generic init params to
the constructor

**Task 4: Deprecate Existing `new()` Factory**
- Add a JSDoc `@deprecated` annotation to the existing `static async new()`
method
- The deprecation message should direct users to use `newJam()` or
`newGeneric()` instead
- Do not change the implementation of `new()` — it must continue to work as
before
```

</details>

<details>
<summary><b>Research</b></summary>

The `AnanasInterpreter` class in `packages/core/pvm-interpreter-ananas/index.ts` implements the `IPvmInterpreter` interface from `@typeberry/pvm-interface`. It wraps a WASM-based PVM (`@fluffylabs/anan-as`) and uses a private constructor with an async factory (`static async new()`). Currently, instances are created without initialization parameters, and callers must subsequently call `resetJam()` or `resetGeneric()` to prepare the interpreter. The interface requires both reset methods, so they must remain public even after refactoring. The main callers are `PvmInstanceManager` (which pools instances) and `host-calls-executor.ts` (which calls `resetJam()` on pooled instances).

</details>


---



### 🚀 Next Steps


<details>
<summary><b>🤖 All AI agent prompts combined</b></summary>

```
Refactor the `AnanasInterpreter` class in
`packages/core/pvm-interpreter-ananas/index.ts` to support initialization
parameters at construction time and expose new single-step factory methods.

**Task 1: Define Initialization Parameter Types**
- Add a type for JAM initialization params with fields: `program: Uint8Array`,
`args: Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g.,
`type: 'jam'`)
- Add a type for Generic initialization params with fields: `rawProgram:
Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g., `type:
'generic'`)
- Create a discriminated union type combining both param types using the `type`
field

**Task 2: Modify the Private Constructor**
- Update the private constructor signature to accept an optional argument of the
discriminated union type
- In the constructor body, add conditional logic that checks the `type`
discriminant and calls the appropriate internal reset logic (`resetJam` or
`resetGeneric` internals) when params are provided
- When no params are provided, preserve the existing behavior (no
initialization)

**Task 3: Add New Factory Methods**
- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number,
gas: Gas)` — instantiate the interpreter (following the same WASM instantiation
pattern as the existing `new()` factory) and pass JAM init params to the
constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` —
instantiate the interpreter (same WASM pattern) and pass Generic init params to
the constructor

**Task 4: Deprecate Existing `new()` Factory**
- Add a JSDoc `@deprecated` annotation to the existing `static async new()`
method
- The deprecation message should direct users to use `newJam()` or
`newGeneric()` instead
- Do not change the implementation of `new()` — it must continue to work as
before
```

</details>


<details>
<summary><b>💡 Iterate on the plan with:
<code>`@coderabbitai` &lt;feedback&gt;</code>
</b></summary>

```
Example Feedback
- `@coderabbitai` You can skip phase 3. Add a simple unit test case for phase 2.
- `@coderabbitai` For design choice 1 go ahead with option 3 and replan.
```

</details>


---



💬 Have feedback or questions? Drop into our [discord](https://discord.gg/coderabbit)!



<!-- <agentComponentType>plan-edits</agentComponentType> -->

<!-- <rawResChunk><planningResult>## Coding Plan

### Summary

- Introduce discriminated union types to represent different initialization modes (JAM/Generic)
- Extend the private constructor to accept optional initialization parameters and perform initialization inline
- Add two new factory methods (`newJam`, `newGeneric`) that provide single-step creation and initialization
- Deprecate the existing `new()` factory via JSDoc while preserving backward compatibility

<details>
<summary><b>Design Choices</b></summary>

<details>
<summary><b>Design Choice 1: Should both `resetJam()` and `resetGeneric()` initialization be supported at construction time?</b></summary>



**Options Considered:**
1. Handle only `resetJam()` initialization at construction
2. Handle both `resetJam()` and `resetGeneric()` initialization for consistency

**Chosen Option:** 2

**Rationale:** Both reset methods should have corresponding factory methods for API consistency and completeness.

</details>

<details>
<summary><b>Design Choice 2: Should the existing `new()` factory be removed or retained?</b></summary>



**Options Considered:**
1. Remove `new()` entirely, forcing callers to use new factories
2. Keep `new()` unchanged for backward compatibility
3. Keep `new()` and mark as deprecated with JSDoc

**Chosen Option:** 3

**Rationale:** Retain and deprecate the existing factory to maintain backward compatibility while signaling the preferred pattern.

</details>

<details>
<summary><b>Design Choice 3: What should happen if `resetJam()`/`resetGeneric()` is called on an already-initialized instance?</b></summary>



**Options Considered:**
1. Allow re-initialization (preserve current behavior)
2. Throw an error to enforce single-use
3. No-op to silently prevent re-initialization

**Chosen Option:** 1

**Rationale:** Allow re-initialization to maintain interface compliance and backward compatibility. Single-use semantics are enforced by convention, not by runtime errors.

</details>

</details>

<b>💡 User Tips</b>

Regenerate the plan with different choices with `@coderabbitai <feedback>`.


## Implementation Steps


### Refactor AnanasInterpreter Constructor and Factories

This phase modifies the `AnanasInterpreter` class to accept initialization parameters at construction time and provides new factory methods that create ready-to-run interpreter instances.


<details>
<summary><b>Task 1: Define Initialization Parameter Types</b></summary>

Define discriminated union types to represent the different initialization modes (JAM vs Generic) that can be passed to the constructor.

- Add a type definition in `packages/core/pvm-interpreter-ananas/index.ts` for JAM initialization params (program, args, pc, gas)
- Add a type definition for Generic initialization params (rawProgram, pc, gas)
- Create a discriminated union type combining both with a `type` discriminant field

</details>


<details>
<summary><b>Task 2: Modify Constructor to Accept Initialization Parameters</b></summary>

Extend the private constructor to optionally accept initialization parameters and perform initialization during construction.

- Update the constructor signature in `packages/core/pvm-interpreter-ananas/index.ts` to accept an optional initialization params argument
- Add conditional logic in the constructor body that calls the appropriate internal reset logic based on the params type discriminant
- Ensure the existing behavior (no initialization) is preserved when params are omitted

</details>


<details>
<summary><b>Task 3: Add New Factory Methods</b></summary>

Create new async factory methods that instantiate the interpreter with initialization in a single step.

- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number, gas: Gas)` factory that creates an instance and passes JAM init params to constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` factory that creates an instance and passes Generic init params to constructor
- Both factories should follow the same WASM instantiation pattern as the existing `new()` factory

</details>


<details>
<summary><b>Task 4: Deprecate Existing Factory</b></summary>

Mark the existing `new()` factory as deprecated while preserving its functionality.

- Add JSDoc `@deprecated` annotation to the existing `static async new()` method in `packages/core/pvm-interpreter-ananas/index.ts`
- Include a message directing users to `newJam()` or `newGeneric()` as the preferred alternatives
- Do not modify the implementation—it should continue working for backward compatibility

</details>


<details>
<summary><b>🤖 Prompt for AI agents</b></summary>

```
Refactor the `AnanasInterpreter` class in
`packages/core/pvm-interpreter-ananas/index.ts` to support initialization
parameters at construction time and expose new single-step factory methods.

**Task 1: Define Initialization Parameter Types**
- Add a type for JAM initialization params with fields: `program: Uint8Array`,
`args: Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g.,
`type: 'jam'`)
- Add a type for Generic initialization params with fields: `rawProgram:
Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g., `type:
'generic'`)
- Create a discriminated union type combining both param types using the `type`
field

**Task 2: Modify the Private Constructor**
- Update the private constructor signature to accept an optional argument of the
discriminated union type
- In the constructor body, add conditional logic that checks the `type`
discriminant and calls the appropriate internal reset logic (`resetJam` or
`resetGeneric` internals) when params are provided
- When no params are provided, preserve the existing behavior (no
initialization)

**Task 3: Add New Factory Methods**
- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number,
gas: Gas)` — instantiate the interpreter (following the same WASM instantiation
pattern as the existing `new()` factory) and pass JAM init params to the
constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` —
instantiate the interpreter (same WASM pattern) and pass Generic init params to
the constructor

**Task 4: Deprecate Existing `new()` Factory**
- Add a JSDoc `@deprecated` annotation to the existing `static async new()`
method
- The deprecation message should direct users to use `newJam()` or
`newGeneric()` instead
- Do not change the implementation of `new()` — it must continue to work as
before
```

</details>

<details>
<summary><b>Research</b></summary>

The `AnanasInterpreter` class in `packages/core/pvm-interpreter-ananas/index.ts` implements the `IPvmInterpreter` interface from `@typeberry/pvm-interface`. It wraps a WASM-based PVM (`@fluffylabs/anan-as`) and uses a private constructor with an async factory (`static async new()`). Currently, instances are created without initialization parameters, and callers must subsequently call `resetJam()` or `resetGeneric()` to prepare the interpreter. The interface requires both reset methods, so they must remain public even after refactoring. The main callers are `PvmInstanceManager` (which pools instances) and `host-calls-executor.ts` (which calls `resetJam()` on pooled instances).

</details>


---



### 🚀 Next Steps


<details>
<summary><b>🤖 All AI agent prompts combined</b></summary>

```
Refactor the `AnanasInterpreter` class in
`packages/core/pvm-interpreter-ananas/index.ts` to support initialization
parameters at construction time and expose new single-step factory methods.

**Task 1: Define Initialization Parameter Types**
- Add a type for JAM initialization params with fields: `program: Uint8Array`,
`args: Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g.,
`type: 'jam'`)
- Add a type for Generic initialization params with fields: `rawProgram:
Uint8Array`, `pc: number`, `gas: Gas`, and a `type` discriminant (e.g., `type:
'generic'`)
- Create a discriminated union type combining both param types using the `type`
field

**Task 2: Modify the Private Constructor**
- Update the private constructor signature to accept an optional argument of the
discriminated union type
- In the constructor body, add conditional logic that checks the `type`
discriminant and calls the appropriate internal reset logic (`resetJam` or
`resetGeneric` internals) when params are provided
- When no params are provided, preserve the existing behavior (no
initialization)

**Task 3: Add New Factory Methods**
- Add `static async newJam(program: Uint8Array, args: Uint8Array, pc: number,
gas: Gas)` — instantiate the interpreter (following the same WASM instantiation
pattern as the existing `new()` factory) and pass JAM init params to the
constructor
- Add `static async newGeneric(rawProgram: Uint8Array, pc: number, gas: Gas)` —
instantiate the interpreter (same WASM pattern) and pass Generic init params to
the constructor

**Task 4: Deprecate Existing `new()` Factory**
- Add a JSDoc `@deprecated` annotation to the existing `static async new()`
method
- The deprecation message should direct users to use `newJam()` or
`newGeneric()` instead
- Do not change the implementation of `new()` — it must continue to work as
before
```

</details>


<details>
<summary><b>💡 Iterate on the plan with:
<code>`@coderabbitai` &lt;feedback&gt;</code>
</b></summary>

```
Example Feedback
- `@coderabbitai` You can skip phase 3. Add a simple unit test case for phase 2.
- `@coderabbitai` For design choice 1 go ahead with option 3 and replan.
```

</details>


---



💬 Have feedback or questions? Drop into our [discord](https://discord.gg/coderabbit)!</planningResult></rawResChunk> -->

<!-- <agentComponentType>plan-edits</agentComponentType> -->
