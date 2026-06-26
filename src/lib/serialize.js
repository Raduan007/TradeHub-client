export function serializeDocument(document) {
  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;

  return {
    id: _id.toString(),
    ...rest,
  };
}

export function serializeDocuments(documents) {
  return documents.map(serializeDocument);
}
