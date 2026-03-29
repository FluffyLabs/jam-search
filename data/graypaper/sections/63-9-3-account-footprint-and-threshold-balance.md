---
type: graypaper_section
title: 9.3. Account Footprint and Threshold Balance
index: 63
---
We define the dependent values i and o as the storage footprint of the service, specifically the number of items in storage and the total number of octets used in storage. They are defined purely in terms of the storage map of a service, and it must be assumed that whenever a service’s storage is changed, these change also. Furthermore, as we will see in the account serialization function in section C, these are expected to be found explicitly within the Merklized state data. Because of this we make explicit their set. We may then define a second dependent term t, the minimum, or threshold, balance needed for any given service account in terms of its storage footprint. ∀ a ∈ V (δ) ∶ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ a i ∈ N 2 32 ≡ 2 ⋅ S a l S + S a s S a o ∈ N 2 64 ≡ ∑ (h,z) ∈ K (a l) 81 + z + ∑ x ∈ V (a s) 32 + S x S a t ∈ N B ≡ B S + B I ⋅ a i + B L ⋅ a o (9.8)
