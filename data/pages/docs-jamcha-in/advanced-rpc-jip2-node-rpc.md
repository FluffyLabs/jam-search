---
type: page
url: 'https://docs.jamcha.in/advanced/rpc/jip2-node-rpc'
title: 'JIP-2: Node RPC | JAM Docs'
site: docs.jamcha.in
created_at: '2026-06-09T04:23:00.723Z'
last_modified: '2026-06-09T04:23:00.723Z'
---
(fetched from [here](https://github.com/polkadot-fellows/JIPs/blob/main/JIP-2.md) on 2026-03-28)

RPC specification for JAM nodes to ensure JAM tooling which relies on being an RPC client is implementation-agnostic.

## Notes[​](#notes "Direct link to Notes")

RPCs are evil and should generally not be used: they lead to chronic centralisation and trust-maximisation (just see Ethereum for a great example of this trap).

However, there are not at present any light clients for JAM and the resources needed to run a regular client make the inclusion of a full-client inside of tooling to be unrealistic. We must therefore reluctantly presume that the tool-user has access to a trustworthy full node and can use its RPCs.

As soon as a light-client implementation is viable, the use of RPCs should be phased out immediately in favour of embedded light-clients in the tooling.

## Protocol[​](#protocol "Direct link to Protocol")

JSON-RPC 2.0 is used, as defined by [https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification). Except for subscription Notifications, all method parameters are passed by-position, i.e. the `"params"` member of Request objects should be an Array.

Generally JSON-RPC can be used over a variety of media and we don't make any assumptions of this, but it is envisaged that Websockets will be the usual medium, on port 19800.

### Subscriptions[​](#subscriptions "Direct link to Subscriptions")

A subscription is created by calling a `subscribe` method, e.g. `subscribeFinalizedBlock`. On success, the ID of the subscription is returned (a Number). A subscription can be stopped by calling the corresponding `unsubscribe` method (e.g. `unsubscribeFinalizedBlock`), passing the subscription ID as the sole parameter. For brevity these unsubscribe methods are not listed below.

Subscription updates are sent as Notifications, i.e. Requests without an `"id"` member. The method name of such a Notification should match the name of the `subscribe` method originally used to create the subscription, e.g. `subscribeFinalizedBlock`. The `"params"` member should be an Object with a `"subscription"` member giving the subscription ID. This Object should also contain either a subscription-specific `"result"` member, or an `"error"` member with a String containing a human-readable error message.

## Common types[​](#common-types "Direct link to Common types")

For convenience the following common types are defined:

*   Blob: A String, containing padded Base64-encoded binary data, as per RFC 4648. The decoded data can have an arbitrary length.
*   Hash: A String, containing padded Base64-encoded binary data, as per RFC 4648. The decoded data must be 32 bytes in length.
*   Block Descriptor: An Object with the following members:
    *   `"header_hash"`: Hash. Hash of the block's header.
    *   `"slot"`: Number. The block's slot; this must match the slot field in the block's header.
*   Chain Subscription Update: An Object with the following members:
    *   `"header_hash"`: Hash. Header hash of the block that triggered this update.
    *   `"slot"`: Number. Slot of the block that triggered this update.
    *   `"value"`: Subscription-specific.

## Error codes[​](#error-codes "Direct link to Error codes")

The following error codes are defined:

*   1: Block unavailable. The `"data"` member of the error Object should be the Hash of the block's header.
*   2: Work-report unavailable. The `"data"` member of the error Object should be the Hash of the work-report.
*   3: DA segment unavailable.
*   0: Other error.

Later revisions of this specification may define further error codes, as such:

*   RPC clients should not assume this list is exhaustive.
*   RPC servers should only use error codes defined here or in the JSON-RPC specification; they should not invent additional codes.

## Chain subscriptions[​](#chain-subscriptions "Direct link to Chain subscriptions")

The `subscribe` methods which create subscriptions tracking chain state all take a Boolean argument indicating which chain to track: True meaning track the latest finalized block, False meaning track the head of the "best" chain.

As the "best" chain may switch to a different fork at any time:

*   Updates yielded by a subscription following the best chain are not guaranteed to ever be included in the finalized chain.
*   Subscriptions following the best chain may yield "impossible" update sequences. For example, a subscription created with `subscribeWorkPackageStatus(..., false)` may yield a `"Reported"` status followed by a `"Reportable"` status, if the best chain switches from a fork where the package has been reported to a fork where it has not.

If these behaviours are unacceptable, use subscriptions tracking the latest finalized block instead. Such subscriptions are well-behaved, but may be significantly delayed compared to best-chain subscriptions.

## Methods[​](#methods "Direct link to Methods")

### `parameters()`[​](#parameters "Direct link to parameters")

Returns the chain parameters.

#### Result[​](#result "Direct link to Result")

An Object describing the JAM chain parameterization, which may not be equivalent to the canonical parameterization of the Gray Paper. The Object has a single `"V1"` member, which itself is an Object with the following members, all Numbers:

*   `"deposit_per_item"`: BI\\mathsf{B}\_IBI​, the additional minimum balance required per item of elective service state.
*   `"deposit_per_byte"`: BL\\mathsf{B}\_LBL​, the additional minimum balance required per octet of elective service state
*   `"deposit_per_account"`: BS\\mathsf{B}\_SBS​, the basic minimum balance which all services require.
*   `"core_count"`: C\\mathsf{C}C, the total number of cores.
*   `"min_turnaround_period"`: D\\mathsf{D}D, the period in timeslots after which an unreferenced preimage may be expunged.
*   `"epoch_period"`: E\\mathsf{E}E, the length of an epoch in timeslots.
*   `"max_accumulate_gas"`: GA\\mathsf{G}\_AGA​, the gas allocated to invoke a work-report’s Accumulation logic.
*   `"max_is_authorized_gas"`: GI\\mathsf{G}\_IGI​, the gas allocated to invoke a work-package’s Is-Authorized logic.
*   `"max_refine_gas"`: GR\\mathsf{G}\_RGR​, the gas allocated to invoke a work-package’s Refine logic.
*   `"block_gas_limit"`: GT\\mathsf{G}\_TGT​, the total gas allocated for all Accumulation in a block.
*   `"recent_block_count"`: H\\mathsf{H}H, the size of recent history, in blocks.
*   `"max_work_items"`: I\\mathsf{I}I, the maximum amount of work items in a package.
*   `"max_dependencies"`: J\\mathsf{J}J, the maximum sum of dependency items in a work-report.
*   `"max_tickets_per_block"`: K\\mathsf{K}K, the maximum number of tickets which may be submitted in a single extrinsic.
*   `"max_lookup_anchor_age"`: L\\mathsf{L}L, the maximum age in timeslots of the lookup anchor.
*   `"tickets_attempts_number"`: N\\mathsf{N}N, the number of ticket entries per validator.
*   `"auth_window"`: O\\mathsf{O}O, the maximum number of items in the authorizations pool.
*   `"slot_period_sec"`: P\\mathsf{P}P, the slot period, in seconds.
*   `"auth_queue_len"`: Q\\mathsf{Q}Q, the number of items in the authorizations queue.
*   `"rotation_period"`: R\\mathsf{R}R, the rotation period of validator-core assignments, in timeslots.
*   `"max_extrinsics"`: T\\mathsf{T}T, the maximum number of extrinsics in a work-package.
*   `"availability_timeout"`: U\\mathsf{U}U, the period in timeslots after which reported but unavailable work may be replaced.
*   `"val_count"`: V\\mathsf{V}V, the total number of validators.
*   `"max_authorizer_code_size"`: WA\\mathsf{W}\_AWA​, the maximum size of is-authorized code in octets.
*   `"max_input"`: WB\\mathsf{W}\_BWB​, the maximum size of the concatenated variable-size blobs, extrinsics and imported segments of a work-package, in octets.
*   `"max_service_code_size"`: WC\\mathsf{W}\_CWC​, the maximum size of service code in octets.
*   `"basic_piece_len"`: WE\\mathsf{W}\_EWE​, the basic size of erasure-coded pieces in octets.
*   `"max_imports"`: WM\\mathsf{W}\_MWM​, the maximum number of imports in a work-package.
*   `"segment_piece_count"`: WP\\mathsf{W}\_PWP​, the number of erasure-coded pieces in a segment.
*   `"max_report_elective_data"`: WR\\mathsf{W}\_RWR​, the maximum total size of all unbounded blobs in a work-report, in octets.
*   `"transfer_memo_size"`: WT\\mathsf{W}\_TWT​, the size of a transfer memo in octets.
*   `"max_exports"`: WX\\mathsf{W}\_XWX​, the maximum number of exports in a work-package.
*   `"epoch_tail_start"`: Y\\mathsf{Y}Y, the number of slots into an epoch at which ticket-submission ends.

All parameters not described are assumed to be their canonical values. Some parameters are dependent on other values:

*   WG\=4,104\\mathsf{W}\_G = 4,104WG​\=4,104: The size of a (reconstructed) segment is fixed.
*   WP\=WGWE\\mathsf{W}\_P = \\frac{\\mathsf{W}\_G}{\\mathsf{W}\_E}WP​\=WE​WG​​: The number of EC pieces in a segment.

### `bestBlock()`[​](#bestblock "Direct link to bestblock")

Returns the header hash and slot of the head of the "best" chain.

#### Result[​](#result-1 "Direct link to Result")

Block Descriptor.

### `subscribeBestBlock()`[​](#subscribebestblock "Direct link to subscribebestblock")

Subscribe to updates of the head of the "best" chain, as returned by `bestBlock`.

#### Subscription update `"result"`[​](#subscription-update-result "Direct link to subscription-update-result")

Block Descriptor.

### `finalizedBlock()`[​](#finalizedblock "Direct link to finalizedblock")

Returns the header hash and slot of the latest finalized block.

#### Result[​](#result-2 "Direct link to Result")

Block Descriptor.

### `subscribeFinalizedBlock()`[​](#subscribefinalizedblock "Direct link to subscribefinalizedblock")

Subscribe to updates of the latest finalized block, as returned by `finalizedBlock`.

#### Subscription update `"result"`[​](#subscription-update-result-1 "Direct link to subscription-update-result-1")

Block Descriptor.

### `parent(header_hash)`[​](#parentheader_hash "Direct link to parentheader_hash")

Returns the header hash and slot of the parent of the block with the given header hash.

#### Parameters[​](#parameters-1 "Direct link to Parameters")

1.  `header_hash`: Hash.

#### Result[​](#result-3 "Direct link to Result")

Block Descriptor: The parent of the block with the given header hash.

### `stateRoot(header_hash)`[​](#staterootheader_hash "Direct link to staterootheader_hash")

Returns the posterior state root of the block with the given header hash.

#### Parameters[​](#parameters-2 "Direct link to Parameters")

1.  `header_hash`: Hash.

#### Result[​](#result-4 "Direct link to Result")

Hash: The state root.

### `beefyRoot(header_hash)`[​](#beefyrootheader_hash "Direct link to beefyrootheader_hash")

Returns the BEEFY root of the block with the given header hash.

#### Parameters[​](#parameters-3 "Direct link to Parameters")

1.  `header_hash`: Hash.

#### Result[​](#result-5 "Direct link to Result")

Hash: The BEEFY root.

### `statistics(header_hash)`[​](#statisticsheader_hash "Direct link to statisticsheader_hash")

Returns the activity statistics stored in the posterior state of the block with the given header hash.

#### Parameters[​](#parameters-4 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.

#### Result[​](#result-6 "Direct link to Result")

Blob: Activity statistics encoded as per the GP.

### `subscribeStatistics(finalized)`[​](#subscribestatisticsfinalized "Direct link to subscribestatisticsfinalized")

Subscribe to updates of the activity statistics stored in chain state.

#### Parameters[​](#parameters-5 "Direct link to Parameters")

1.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-2 "Direct link to subscription-update-result-2")

Chain Subscription Update. The `"value"` member is a Blob, containing activity statistics encoded as per the GP.

### `serviceData(header_hash, id)`[​](#servicedataheader_hash-id "Direct link to servicedataheader_hash-id")

Returns the storage data for the service with the given ID.

#### Parameters[​](#parameters-6 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.
2.  `id`: Number: The ID of the service.

#### Result[​](#result-7 "Direct link to Result")

Null if there is no service with the given ID, or Blob, containing the service data encoded as per the GP.

### `subscribeServiceData(id, finalized)`[​](#subscribeservicedataid-finalized "Direct link to subscribeservicedataid-finalized")

Subscribe to updates of the storage data for the service with the given ID.

#### Parameters[​](#parameters-7 "Direct link to Parameters")

1.  `id`: Number: The ID of the service.
2.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-3 "Direct link to subscription-update-result-3")

Chain Subscription Update. The `"value"` member is Null when there is no service with the given ID, otherwise it is a Blob containing the service data encoded as per the GP.

### `serviceValue(header_hash, id, key)`[​](#servicevalueheader_hash-id-key "Direct link to servicevalueheader_hash-id-key")

Returns the value associated with the given service ID and key in the posterior state of the block with the given header hash. This method can be used to query arbitrary key-value pairs set by service accumulation logic.

#### Parameters[​](#parameters-8 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.
2.  `id`: Number: The ID of the service.
3.  `key`: Blob: The key.

#### Result[​](#result-8 "Direct link to Result")

Null if there is no value associated with the given service ID and key, otherwise a Blob containing the value.

### `subscribeServiceValue(id, key, finalized)`[​](#subscribeservicevalueid-key-finalized "Direct link to subscribeservicevalueid-key-finalized")

Subscribe to updates of the value associated with the given service ID and key.

#### Parameters[​](#parameters-9 "Direct link to Parameters")

1.  `id`: Number: The ID of the service.
2.  `key`: Blob: The key.
3.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-4 "Direct link to subscription-update-result-4")

Chain Subscription Update. The `"value"` member is Null when there is no value associated with the given service ID and key. Otherwise, it is a Blob containing the value.

### `servicePreimage(header_hash, id, hash)`[​](#servicepreimageheader_hash-id-hash "Direct link to servicepreimageheader_hash-id-hash")

Returns the preimage of the given hash, if it has been provided to the given service in the posterior state of the block with the given header hash.

#### Parameters[​](#parameters-10 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.
2.  `id`: Number: The ID of the service.
3.  `hash`: Hash: The hash whose preimage is being requested.

#### Result[​](#result-9 "Direct link to Result")

Null if the preimage has not been provided to the given service, otherwise a Blob containing the preimage.

### `subscribeServicePreimage(id, hash, finalized)`[​](#subscribeservicepreimageid-hash-finalized "Direct link to subscribeservicepreimageid-hash-finalized")

Subscribe to updates of the preimage associated with the given service ID and hash.

#### Parameters[​](#parameters-11 "Direct link to Parameters")

1.  `id`: Number: The ID of the service.
2.  `hash`: Hash. The hash whose preimage is of interest.
3.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-5 "Direct link to subscription-update-result-5")

Chain Subscription Update. The `"value"` member is Null if the preimage has not been provided to the service, otherwise it is a Blob containing the preimage.

### `serviceRequest(header_hash, id, hash, len)`[​](#servicerequestheader_hash-id-hash-len "Direct link to servicerequestheader_hash-id-hash-len")

Returns the preimage request associated with the given service ID and hash/length in the posterior state of the block with the given header hash.

#### Parameters[​](#parameters-12 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.
2.  `id`: Number: The ID of the service.
3.  `hash`: Hash: The hash of the preimage.
4.  `len`: Number: The preimage length.

#### Result[​](#result-10 "Direct link to Result")

Null if the preimage with the given hash/length has neither been requested by nor provided to the given service. An empty Array if the preimage has been requested, but not yet provided. Otherwise, i.e. if the preimage has been provided, an Array of between 1 and 3 Numbers. The meaning of the Numbers is as follows:

*   The first Number is the slot in which the preimage was provided.
*   The second Number, if present, is the slot in which the preimage was "forgotten".
*   The third Number, if present, is the slot in which the preimage was requested again.

### `subscribeServiceRequest(id, hash, len, finalized)`[​](#subscribeservicerequestid-hash-len-finalized "Direct link to subscribeservicerequestid-hash-len-finalized")

Subscribe to updates of the preimage request associated with the given service ID and hash/length.

#### Parameters[​](#parameters-13 "Direct link to Parameters")

1.  `id`: Number: The ID of the service.
2.  `hash`: Hash: The hash of the preimage.
3.  `len`: Number: The preimage length.
4.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-6 "Direct link to subscription-update-result-6")

Chain Subscription Update. The `"value"` member is either Null or an Array of Numbers, with the same semantics as the result of the `serviceRequest` method.

### `workReport(hash)`[​](#workreporthash "Direct link to workreporthash")

Returns the work-report with the given hash.

#### Parameters[​](#parameters-14 "Direct link to Parameters")

1.  `hash`: Hash: Hash of the work-report.

#### Result[​](#result-11 "Direct link to Result")

Blob: The work-report with the given hash, encoded as per the GP.

### `submitWorkPackage(core, package, extrinsics)`[​](#submitworkpackagecore-package-extrinsics "Direct link to submitworkpackagecore-package-extrinsics")

Submit a work-package to the guarantors currently assigned to the given core. This method will return successfully if the work-package is submitted to at least one guarantor. It will not wait for the package to be refined, reported, or accumulated. You should use e.g. `subscribeWorkPackageStatus` to monitor the status of submitted work-packages.

#### Parameters[​](#parameters-15 "Direct link to Parameters")

1.  `core`: Number: The index of the core.
2.  `package`: Blob: The work-package, encoded as per the GP.
3.  `extrinsics`: Array of Blobs: The extrinsics.

#### Result[​](#result-12 "Direct link to Result")

Null.

### `submitWorkPackageBundle(core, bundle)`[​](#submitworkpackagebundlecore-bundle "Direct link to submitworkpackagebundlecore-bundle")

Submit a work-bundle to the guarantors currently assigned to the given core. This method will return successfully if the bundle is submitted to at least one guarantor. It will not wait for the package to be refined, reported, or accumulated. You should use e.g. `subscribeWorkPackageStatus` to monitor the status of submitted work-packages.

#### Parameters[​](#parameters-16 "Direct link to Parameters")

1.  `core`: Number: The index of the core.
2.  `bundle`: Blob: The work-bundle, encoded as per the GP.

#### Result[​](#result-13 "Direct link to Result")

Null.

### `workPackageStatus(header_hash, hash, anchor)`[​](#workpackagestatusheader_hash-hash-anchor "Direct link to workpackagestatusheader_hash-hash-anchor")

Returns the status of the given work-package following execution of the block with the given header hash.

#### Parameters[​](#parameters-17 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.
2.  `hash`: Hash: The hash of the work-package.
3.  `anchor`: Hash: The hash of the work-package's anchor block's header. If this does not match the anchor specified in the work-package then an error or an incorrect status may be returned. An error may also be returned if this anchor block is too old.

#### Result[​](#result-14 "Direct link to Result")

An Object with one of the following structures:

*   {"Reportable": { "remaining\_blocks": Number }}

This means the work-package has not yet been reported, but could be reported in a descendant block.

`"remaining_blocks"` is the number of blocks remaining until the work-package can no longer be reported. 1 for example means that the next block is the last block in which the work-package can be reported.

*   {"Reported": { "reported\_in": Block Descriptor, "core": Number, "report\_hash": Hash }}

This means the work-package has been reported but is not yet available.

`"reported_in"` identifies the block in which the work-package was reported. `"core"` is the core on which the work-package was reported. `"report_hash"` is the hash of the work-report that was included on-chain.

*   {"Ready": { "reported\_in": Block Descriptor, "core": Number, "report\_hash": Hash, "ready\_in": Block Descriptor }}

This means the work-package is ready, i.e. it is either available or has been audited. A ready work-package is queued for accumulation once its prerequisites are met. Accumulation of a ready work-package is not guaranteed, in particular its prerequisites may never be met. Note that there is no `"Accumulated"` status to indicate when accumulation has happened. To determine if/when a work-package is accumulated, you should monitor service state for the expected changes using e.g. `subscribeServiceValue`.

`"reported_in"`, `"core"`, and `"report_hash"` have the same meaning as for the `"Reported"` status. `"ready_in"` identifies the block in which the work-package became ready.

*   {"Failed": String}

This means the work-package cannot become ready _on this fork_. This could be because:

*   Its anchor is on a different fork.
*   It was not reported in time.
*   It did not become available in time.

The String is a freeform message giving details.

### `subscribeWorkPackageStatus(hash, anchor, finalized)`[​](#subscribeworkpackagestatushash-anchor-finalized "Direct link to subscribeworkpackagestatushash-anchor-finalized")

Subscribe to status updates for the given work-package.

#### Parameters[​](#parameters-18 "Direct link to Parameters")

1.  `hash`: Hash: The hash of the work-package.
2.  `anchor`: Hash: The hash of the work-package's anchor block's header. If this does not match the anchor specified in the work-package then the subscription may fail or yield incorrect statuses. The subscription may also fail if this anchor block is too old.
3.  `finalized`: Boolean: True to track the latest finalized block, False to track the head of the "best" chain.

#### Subscription update `"result"`[​](#subscription-update-result-7 "Direct link to subscription-update-result-7")

Chain Subscription Update. The `"value"` member has the same structure and semantics as the result of the `workPackageStatus` method.

### `submitPreimage(requester, preimage)`[​](#submitpreimagerequester-preimage "Direct link to submitpreimagerequester-preimage")

Submit a preimage which is being requested by the given service. Note that this method does not wait for the preimage to be distributed or integrated on-chain; it returns immediately.

#### Parameters[​](#parameters-19 "Direct link to Parameters")

1.  `requester`: Number: The ID of the service which has an outstanding request.
2.  `preimage`: Blob: The preimage requested.

#### Result[​](#result-15 "Direct link to Result")

Null.

### `listServices(header_hash)`[​](#listservicesheader_hash "Direct link to listservicesheader_hash")

Returns a list of all services currently known to be on JAM. This is a best-effort list and may not reflect the true state. Nodes could e.g. reasonably hide services which are not recently active from this list.

#### Parameters[​](#parameters-20 "Direct link to Parameters")

1.  `header_hash`: Hash: The header hash indicating the block whose posterior state should be used for the query.

#### Result[​](#result-16 "Direct link to Result")

Array of Numbers: The IDs of the services currently known to be on JAM.

### `fetchWorkPackageSegments(wp_hash, indices)`[​](#fetchworkpackagesegmentswp_hash-indices "Direct link to fetchworkpackagesegmentswp_hash-indices")

Fetches a list of segments from the DA layer, exported by the work-package with the given hash.

#### Parameters[​](#parameters-21 "Direct link to Parameters")

1.  `wp_hash`: Hash: Hash of the exporting work-package.
2.  `indices`: Array of Numbers: Indices into the list of segments exported by the work-package.

#### Result[​](#result-17 "Direct link to Result")

Array of Blobs: The requested segments. Each Blob should be 4104 bytes long and the length of the Array should match the length of the `indices` Array passed in to the method.

### `fetchSegments(segment_root, indices)`[​](#fetchsegmentssegment_root-indices "Direct link to fetchsegmentssegment_root-indices")

Fetches a list of segments from the DA layer, exported by a work-package with the given segment root hash.

#### Parameters[​](#parameters-22 "Direct link to Parameters")

1.  `segment_root`: Hash: Segment tree root hash of a work-package.
2.  `indices`: Array of Numbers: Indices into the list of segments exported by the work-package.

#### Result[​](#result-18 "Direct link to Result")

Array of Blobs: The requested segments. Each Blob should be 4104 bytes long and the length of the Array should match the length of the `indices` Array passed in to the method.

### `syncState()`[​](#syncstate "Direct link to syncstate")

Returns the sync state of the node.

#### Result[​](#result-19 "Direct link to Result")

An Object with the following members:

*   `"num_peers"`: Number of peers with an active UP 0 (block announcement) stream.
*   `"status"`: A String that is either `"InProgress"` or `"Completed"`.

### `subscribeSyncStatus()`[​](#subscribesyncstatus "Direct link to subscribesyncstatus")

Subscribe to changes in sync status.

#### Subscription update `"result"`[​](#subscription-update-result-8 "Direct link to subscription-update-result-8")

String: Either `"InProgress"` or `"Completed"`.

*   [Notes](#notes)
*   [Protocol](#protocol)
    *   [Subscriptions](#subscriptions)
*   [Common types](#common-types)
*   [Error codes](#error-codes)
*   [Chain subscriptions](#chain-subscriptions)
*   [Methods](#methods)
    *   [`parameters()`](#parameters)
    *   [`bestBlock()`](#bestblock)
    *   [`subscribeBestBlock()`](#subscribebestblock)
    *   [`finalizedBlock()`](#finalizedblock)
    *   [`subscribeFinalizedBlock()`](#subscribefinalizedblock)
    *   [`parent(header_hash)`](#parentheader_hash)
    *   [`stateRoot(header_hash)`](#staterootheader_hash)
    *   [`beefyRoot(header_hash)`](#beefyrootheader_hash)
    *   [`statistics(header_hash)`](#statisticsheader_hash)
    *   [`subscribeStatistics(finalized)`](#subscribestatisticsfinalized)
    *   [`serviceData(header_hash, id)`](#servicedataheader_hash-id)
    *   [`subscribeServiceData(id, finalized)`](#subscribeservicedataid-finalized)
    *   [`serviceValue(header_hash, id, key)`](#servicevalueheader_hash-id-key)
    *   [`subscribeServiceValue(id, key, finalized)`](#subscribeservicevalueid-key-finalized)
    *   [`servicePreimage(header_hash, id, hash)`](#servicepreimageheader_hash-id-hash)
    *   [`subscribeServicePreimage(id, hash, finalized)`](#subscribeservicepreimageid-hash-finalized)
    *   [`serviceRequest(header_hash, id, hash, len)`](#servicerequestheader_hash-id-hash-len)
    *   [`subscribeServiceRequest(id, hash, len, finalized)`](#subscribeservicerequestid-hash-len-finalized)
    *   [`workReport(hash)`](#workreporthash)
    *   [`submitWorkPackage(core, package, extrinsics)`](#submitworkpackagecore-package-extrinsics)
    *   [`submitWorkPackageBundle(core, bundle)`](#submitworkpackagebundlecore-bundle)
    *   [`workPackageStatus(header_hash, hash, anchor)`](#workpackagestatusheader_hash-hash-anchor)
    *   [`subscribeWorkPackageStatus(hash, anchor, finalized)`](#subscribeworkpackagestatushash-anchor-finalized)
    *   [`submitPreimage(requester, preimage)`](#submitpreimagerequester-preimage)
    *   [`listServices(header_hash)`](#listservicesheader_hash)
    *   [`fetchWorkPackageSegments(wp_hash, indices)`](#fetchworkpackagesegmentswp_hash-indices)
    *   [`fetchSegments(segment_root, indices)`](#fetchsegmentssegment_root-indices)
    *   [`syncState()`](#syncstate)
    *   [`subscribeSyncStatus()`](#subscribesyncstatus)
