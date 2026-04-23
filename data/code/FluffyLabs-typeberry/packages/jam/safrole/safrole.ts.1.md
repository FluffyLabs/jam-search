---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L124-L226
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 6
content_sha: fdfdb66fd24e99bf3a60e960a5bf015ea10e44916228bcd9710454fc2de20553
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 124–226)

```typescript
    const stateEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const blockEpoch = Math.floor(timeslot / this.chainSpec.epochLength);
    return blockEpoch > stateEpoch;
  }

  /** `e' === e` */
  private isSameEpoch(timeslot: TimeSlot): boolean {
    const stateEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const blockEpoch = Math.floor(timeslot / this.chainSpec.epochLength);
    return blockEpoch === stateEpoch;
  }

  /** `e' === e + 1` */
  private isNextEpoch(timeslot: TimeSlot): boolean {
    const stateEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const blockEpoch = Math.floor(timeslot / this.chainSpec.epochLength);
    return blockEpoch === stateEpoch + 1;
  }

  /**
   * Returns slot phase index for given timeslot
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0d87000d8700
   */
  private getSlotPhaseIndex(timeslot: TimeSlot) {
    return timeslot % this.chainSpec.epochLength;
  }

  private getEntropy(timeslot: TimeSlot, entropyHash: EntropyHash): SafroleState["entropy"] {
    const [randomnessAcc, ...rest] = this.state.entropy;

    /**
     * Randomness accumulator - η′ from GP
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0e17020e1702
     */
    const newRandomnessAcc = this.blake2b.hashBlobs([randomnessAcc.raw, entropyHash]).asOpaque();

    /**
     * Randomness history is shifted when epoch is changed
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/0e57020e5702
     */

    if (this.isEpochChanged(timeslot)) {
      return FixedSizeArray.new([newRandomnessAcc, randomnessAcc, rest[0], rest[1]], 4);
    }

    return FixedSizeArray.new([newRandomnessAcc, ...rest], 4);
  }

  /**
   * Pre-populate cache for validator keys, and especially the ring commitment.
   *
   * NOTE the function is still doing quite some work, so it should only be used
   *  once per epoch. The optimisation relies on the fact that the `bandersnatch.getRingCommitment`
   * call will be cached.
   */
  public async prepareValidatorKeysForNextEpoch(postOffenders: ImmutableSortedSet<Ed25519Key>) {
    const stateEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const nextEpochStart = (stateEpoch + 1) * this.chainSpec.epochLength;

    /**
     * In real life, this would occur around ~2840,
     * but this scenario appears in tests, so we need to handle it.
     */
    if (nextEpochStart >= 2 ** 32) {
      logger.warn`Timeslot overflow imminent, cannot prepare validator keys for next epoch.`;
      return Result.ok(null);
    }

    return await this.getValidatorKeys(tryAsTimeSlot(nextEpochStart), postOffenders);
  }

  private async getValidatorKeys(
    timeslot: TimeSlot,
    postOffenders: ImmutableSortedSet<Ed25519Key>,
  ): Promise<Result<EpochValidators, typeof SafroleErrorCode.IncorrectData>> {
    /**
     * Epoch is not changed so the previous state is returned
     */
    if (!this.isEpochChanged(timeslot)) {
      const { nextValidatorData, currentValidatorData, previousValidatorData, epochRoot } = this.state;
      return Result.ok({ nextValidatorData, currentValidatorData, previousValidatorData, epochRoot });
    }

    /**
     * Epoch is changed so we shift validators and calculate new epoch root commitment
     */
    const newNextValidators: PerValidator<ValidatorData> = asOpaqueType(
      this.state.designatedValidatorData.map((validator) => {
        const isOffender = postOffenders.has(validator.ed25519) !== false;

        /**
         * Bandersnatch, ed25519 and bls keys of validators that belongs to offenders are replaced with null keys
         *
         * https://graypaper.fluffylabs.dev/#/5f542d7/0ea2000ea200
         */
        if (isOffender) {
          return ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
```
