module.exports = {
  client: {
    input: {
      target: 'http://localhost:3000/doc',
    },
    output: {
      target: 'src/client/generated/index.ts',
      mode: 'tags-split',
      schemas: 'src/client/generated/model',
      client: 'vue-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/fetch-client.ts',
          name: 'fetchClient',
        },
      },
    },
  },
  clientZod: {
    input: {
      target: 'http://localhost:3000/doc',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/client/generated/index.ts',
      fileExtension: '.zod.ts',
    },
  },
}
