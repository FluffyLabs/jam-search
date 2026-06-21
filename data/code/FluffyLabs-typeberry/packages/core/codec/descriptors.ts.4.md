---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L553-L693
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 4
chunk_total: 6
content_sha: 364cd5d85b621211e7dd7d7b7d14d0c396df29c9710dabc9e1cdd9e2f1c4db11
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 553–693)

```typescript
    sizeHint = addSizeHints(sizeHint, val.sizeHint);
  });

  const skipper = (s: Skipper) => {
    // optimized case for fixed size complex values.
    if (sizeHint.isExact) {
      return s.decoder.skip(sizeHint.bytes);
    }
    forEachDescriptor(descriptors, (_key, descriptor) => {
      descriptor.skip(s);
    });
  };

  const view = objectView(Class, descriptors, sizeHint, skipper);

  // and create the descriptor for the entire class.
  return Descriptor.withView<T, ViewOf<T, D>>(
    Class.name,
    sizeHint,
    (e, t) => {
      forEachDescriptor(descriptors, (key, descriptor) => {
        const value = t[key];
        descriptor.encode(e, value);
      });
    },
    (d) => {
      const constructorParams: OptionalRecord<T> = {};
      forEachDescriptor(descriptors, (key, descriptor) => {
        const value = descriptor.decode(d);
        constructorParams[key] = value;
      });
      return Class.create(constructorParams as CodecRecord<T>);
    },
    skipper,
    view,
  );
};

/** Typesafe iteration of every descriptor in the record object. */
export function forEachDescriptor<T>(
  descriptors: DescriptorRecord<T>,
  f: <K extends keyof DescriptorRecord<T>>(key: K, val: Descriptor<T[K]>) => void,
) {
  for (const key in descriptors) {
    if (typeof key === "string" && key in descriptors) {
      const k = key as keyof DescriptorRecord<T>;
      try {
        f(k, descriptors[k]);
      } catch (e) {
        if (e instanceof EndOfDataError) {
          throw new EndOfDataError(`${key}: ${e}`);
        }
        throw new Error(`${key}: ${e}`);
      }
    }
  }
}

/** A utility function to break an infinite recursion when resolving View types. */
function hasUniqueView<T, V>(a: Descriptor<T, V>) {
  return a.View !== (a as unknown);
}

function objectView<T, D extends DescriptorRecord<T>>(
  Class: ClassConstructor<T>,
  descriptors: D,
  sizeHint: SizeHint,
  skipper: Skip["skip"],
): Descriptor<ViewOf<T, D>> {
  // Create a View, based on the `AbstractView`.
  class ClassView extends ObjectView<T> {
    static new(d: Decoder) {
      return new ClassView(d);
    }

    private constructor(d: Decoder) {
      super(d, Class, descriptors);
    }
  }

  // We need to dynamically extend the prototype to add these extra lazy getters.
  forEachDescriptor(descriptors, (key) => {
    if (typeof key === "string") {
      // add method that returns a nested view.
      Object.defineProperty(ClassView.prototype, key, {
        get: function (this: ClassView): ViewField<unknown, unknown> {
          return this.get(key);
        },
      });
    }
  });

  return Descriptor.new(
    `View<${Class.name}>`,
    sizeHint,
    (e, t) => {
      const encoded = t.encoded();
      e.bytes(Bytes.fromBlob(encoded.raw, encoded.length));
    },
    (d) => {
      const view = ClassView.new(d.clone()) as ViewOf<T, D>;
      skipper(Skipper.new(d));
      return view;
    },
    skipper,
  );
}

function sequenceViewVarLen<T, V>(type: Descriptor<T, V>, options: LengthRange): Descriptor<SequenceView<T, V>> {
  const typeBytes = type.sizeHint.bytes;
  const sizeHint = { bytes: typeBytes * TYPICAL_SEQUENCE_LENGTH, isExact: false };
  const view = type.name !== type.View.name ? `, ${type.View.name}` : "";
  const name = `SeqView<${type.name}${view}>[?]`;

  const skipper = (s: Skipper) => {
    const length = s.decoder.varU32();
    validateLength(options, length, name);
    return s.sequenceFixLen(type, length);
  };

  return Descriptor.new(
    name,
    sizeHint,
    (e, t) => {
      validateLength(options, t.length, name);
      const encoded = t.encoded();
      e.bytes(Bytes.fromBlob(encoded.raw, encoded.length));
    },
    (d) => {
      const view = new SequenceView(d.clone(), type);
      skipper(Skipper.new(d));
      return view;
    },
    skipper,
  );
}

function sequenceViewFixLen<T, V>(
  type: Descriptor<T, V>,
  { fixedLength }: { fixedLength: number },
): Descriptor<SequenceView<T, V>> {
```
