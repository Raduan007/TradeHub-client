export function serializeDocument(document) {
  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;
  const id = _id?.toString?.() ?? String(_id);
  const serialized = {
    _id: id,
    id,
  };

  for (const [key, value] of Object.entries(rest)) {
    if (value instanceof Date) {
      serialized[key] = value.toISOString();
      continue;
    }

    if (value && typeof value === "object" && typeof value.toString === "function" && value._bsontype) {
      serialized[key] = value.toString();
      continue;
    }

    serialized[key] = value;
  }

  return serialized;
}

export function serializeDocuments(documents) {
  return (documents || []).map(serializeDocument);
}
