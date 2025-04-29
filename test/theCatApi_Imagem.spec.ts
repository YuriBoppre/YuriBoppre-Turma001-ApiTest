import pactum from 'pactum';
import { SimpleReporter } from './../simple-reporter';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

describe('The Cat API - Testes de Imagens', () => {
  let imageId = '';
  const apiKey = 'live_D7QFX5040jlWArtHhmcQ4Dz9VMZIYIOSkK3uD5hIo8CbqsivUQEFilw5fxQmGE0z';
  const baseUrl = 'https://api.thecatapi.com/v1';
  const p = pactum;
  const rep = SimpleReporter;

  p.request.setDefaultTimeout(30000);

  beforeAll(() => {
    p.reporter.add(rep);
    if (!apiKey) {
      throw new Error('API key not found in .env file');
    }
  });

  // 1. Testes de Upload de Imagem
  describe('1. Upload de Imagens', () => {
    it('1.1 Deve fazer upload com sucesso de uma imagem válida', async () => {
      const filePath = path.resolve(__dirname, './assets/catphoto.jpg');
      // Verifica se o arquivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      const response = await p
        .spec()
        .post(`${baseUrl}/images/upload`)
        .withHeaders('x-api-key', apiKey)
        .withFile('file', filePath)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          id: /^[a-zA-Z0-9]+$/,
          url: /^https?:\/\//
        });

      imageId = response.json.id;
      expect(imageId).toBeDefined();
      expect(imageId.length).toBeGreaterThan(0);
    });

    it('1.2 Deve retornar erro 400 ao tentar upload sem arquivo', async () => {
      await p
        .spec()
        .post(`${baseUrl}/images/upload`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBody((body) => {
          if (typeof body === 'string') {
            expect(body.toLowerCase()).toContain('file');
            expect(body.toLowerCase()).toContain('required');
          } 
          else if (typeof body === 'object') {
            expect(body.message.toLowerCase()).toContain('file');
          }
        });
    });
  });

  describe('2. Busca de Imagem por ID', () => {
    it('- Deve retornar detalhes da imagem pelo ID', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images/${imageId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: imageId,
          url: /^https?:\/\//
        });
    });

    it('- Deve retornar erro 404 para ID inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images/id_inexistente`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('3. Listagem de Imagens', () => {
    it('- Deve retornar array de imagens', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['id', 'url']
          }
        })
        .expectJsonLike([{
          id: /^[a-zA-Z0-9-]+$/,
          url: /^https?:\/\//
        }]);
    });
  });

  describe('4. Exclusão de Imagem', () => {
    it('- Deve excluir imagem existente', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/images/${imageId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          message: 'SUCCESS'
        });
    });

    it('- Deve retornar erro ao excluir imagem já deletada', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/images/${imageId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('5. Validação de Imagem Deletada', () => {
    it('- Deve retornar 404 ao buscar imagem deletada', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images/${imageId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('6. Validação de Headers', () => {
    it('- Deve incluir content-type application/json nas respostas', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images`)
        .withHeaders('x-api-key', apiKey)
        .expectHeader('content-type', /application\/json/);
    });
  });


  describe('7. Testes de Paginação', () => {
    it('- Deve aceitar parâmetros de paginação', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams({
          page: 2,
          limit: 5
        })
        .expectStatus(StatusCodes.OK);
    });
  });


  describe('8. Testes de Filtros', () => {
    it('- Deve filtrar por mime_type', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams({
          mime_types: 'jpg,png'
        })
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('9. Testes de Performance', () => {
    it('- Deve responder em menos de 2 segundos', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images`)
        .withHeaders('x-api-key', apiKey)
        .expectResponseTime(2000);
    });
  });

  afterAll(() => p.reporter.end());
});