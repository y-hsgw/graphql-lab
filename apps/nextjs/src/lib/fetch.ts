import { TypedDocumentNode } from '@graphql-typed-document-node/core';

const baseUrl = process.env.NESTJS_API + '/graphql';

const toQueryString = (obj: Record<string, string>): string => {
  const params = new URLSearchParams(obj);
  return params.toString();
};

export const fetchPersistedQuery = async <
  Data extends object,
  Variables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<Data, Variables>,
  variables: Variables,
): Promise<{ data: Data; ok: boolean }> => {
  const searchParams = toQueryString({
    query: document.__meta__.hash,
    persisted: 'true',
    variables: JSON.stringify(variables),
  });
  const res = await fetch(`${baseUrl}?${searchParams}`);
  const { data } = await res.json();
  return {
    data,
    ok: res.ok,
  };
};
