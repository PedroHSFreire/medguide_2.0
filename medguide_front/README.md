# MedGuide Mobile

Aplicativo móvel do MedGuide para Android e iOS, criado com React Native, Expo e Expo Router. A API permanece no projeto irmão [Medguide](https://github.com/PedroHSFreire/Medguide).

## Funcionalidades

- Acesso e cadastro separados para pacientes e médicos.
- Sessão autenticada armazenada com Expo SecureStore.
- Busca de médicos por nome e especialidade.
- Solicitação de consultas com seleção nativa de data e horário.
- Acompanhamento de consultas pelo paciente e atualização de status pelo médico.
- Visualização e edição do perfil, além da central de dúvidas.

## Requisitos

- Node.js e npm.
- Expo Go para executar em dispositivo físico ou emulador configurado para Android/iOS.
- API MedGuide acessível pelo dispositivo. Para emuladores, use o endereço de host apropriado em vez de `localhost` quando necessário.

## Executar

```bash
npm install
Copy-Item .env.example .env.local
```

Defina `EXPO_PUBLIC_API_URL` em `.env.local` com a URL base da API, sem `/api`, e inicie o Expo. O exemplo usa `10.0.2.2`, endereço do host visto pelo emulador Android. Para iOS Simulator, `localhost` costuma apontar para o host; em um celular físico, use o IP local do computador na rede Wi-Fi:

```bash
npm start
```

Use o QR code do Expo Go ou os atalhos exibidos pelo Expo CLI. Para abrir diretamente um alvo disponível:

```bash
npm run android
npm run ios
```

## API

O app usa `EXPO_PUBLIC_API_URL` e os endpoints REST do MedGuide, incluindo autenticação e cadastro de paciente/médico, perfis, busca de profissionais e consultas. Chamadas autenticadas enviam o token como `Authorization: Bearer <token>`; no cliente nativo ele fica no armazenamento seguro do dispositivo.

## Estrutura

```text
src/app/             Rotas Expo Router
src/components/      Telas e componentes React Native
src/lib/api.ts       Cliente HTTP e modelos da API
src/lib/auth.tsx     Sessão e autenticação
```
