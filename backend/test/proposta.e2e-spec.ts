import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as path from 'path';

import { AppModule } from '../src/app.module';

describe('Propostas (e2e)', () => {
  let app: INestApplication;

  const validCpf = '12345678909';
  const validBirth = '1990-05-15';
  const under18Birth = new Date(
    new Date().getFullYear() - 17,
    new Date().getMonth(),
    new Date().getDate(),
  ).toISOString().slice(0, 10);

  const makeName = () => `QA Test ${Date.now()}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Caminho feliz: cria -> aparece em aguardando -> upload -> conclui -> bloqueia edição', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/propostas')
      .send({
        nome: makeName(),
        cpf: validCpf,
        dataNascimento: validBirth,
        observacoes: 'Teste automatizado',
      })
      .expect((res) => {
        if (![200, 201].includes(res.status)) {
          throw new Error(`Status inesperado: ${res.status}`);
        }
      });

    const created = createRes.body?.data ?? createRes.body;
    const id = created?.id;
    const status = created?.status;

    expect(id).toBeTruthy();
    expect(status).toBe('AGUARDANDO_COMPROVANTE');

    const listRes = await request(app.getHttpServer())
      .get('/propostas')
      .query({ status: 'AGUARDANDO_COMPROVANTE' })
      .expect(200);

    const listBody = listRes.body?.data ?? listRes.body;
    const list = Array.isArray(listBody) ? listBody : (listBody?.items ?? []);
    const found = list.some((p: any) => p?.id === id);
    expect(found).toBe(true);

    const filePath = path.join(__dirname, 'fixtures', 'proof.png');

    await request(app.getHttpServer())
      .post(`/propostas/${id}/comprovante`)
      .attach('file', filePath)
      .expect((res) => {
        if (![200, 201].includes(res.status)) {
          throw new Error(`Status inesperado no upload: ${res.status}`);
        }
      });

    const getRes = await request(app.getHttpServer())
      .get(`/propostas/${id}`)
      .expect(200);

    const detail = getRes.body?.data ?? getRes.body;
    expect(detail?.status).toBe('CONCLUIDA');

    await request(app.getHttpServer())
      .put(`/propostas/${id}`)
      .send({
        nome: 'Nome Alterado',
        observacoes: 'Tentativa após concluir',
      })
      .expect((res) => {
        if (![400, 403, 409].includes(res.status)) {
          throw new Error(`Era esperado bloqueio, mas veio: ${res.status}`);
        }
      });
  });

  it('Validação: não permite criar com CPF inválido', async () => {
    await request(app.getHttpServer())
      .post('/propostas')
      .send({
        nome: makeName(),
        cpf: '12345678900',
        dataNascimento: validBirth,
        observacoes: 'CPF inválido',
      })
      .expect((res) => {
        if (![400, 422].includes(res.status)) {
          throw new Error(`Esperava 400/422, veio: ${res.status}`);
        }
      });
  });

  it('Validação: não permite criar com idade < 18', async () => {
    await request(app.getHttpServer())
      .post('/propostas')
      .send({
        nome: makeName(),
        cpf: validCpf,
        dataNascimento: under18Birth,
        observacoes: 'Menor de idade',
      })
      .expect((res) => {
        if (![400, 422].includes(res.status)) {
          throw new Error(`Esperava 400/422, veio: ${res.status}`);
        }
      });
  });

  it('Validação: campos obrigatórios', async () => {
    await request(app.getHttpServer())
      .post('/propostas')
      .send({
        nome: '',
        cpf: '',
        dataNascimento: '',
      })
      .expect((res) => {
        if (![400, 422].includes(res.status)) {
          throw new Error(`Esperava 400/422, veio: ${res.status}`);
        }
      });
  });
});
