// Evolution v2 webhook payloads with fake values. The message shapes (key fields,
// @lid addressing with remoteJidAlt, @newsletter) mirror records of a real instance;
// status and call follow the Evolution and Baileys docs, since none was stored.

export const contactText = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '100000000000001@lid',
      fromMe: false,
      id: 'TESTMSG00000001',
      remoteJidAlt: '5511900000001@s.whatsapp.net',
      addressingMode: 'lid',
      participant: '',
    },
    pushName: 'Contato Teste',
    message: {
      conversation: 'Oi, vocês têm esse produto?',
    },
    messageType: 'conversation',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const contactAudio = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '100000000000001@lid',
      fromMe: false,
      id: 'TESTMSG00000002',
    },
    pushName: 'Contato Teste',
    message: {
      audioMessage: {
        url: 'https://mmg.whatsapp.net/fake',
        mimetype: 'audio/ogg; codecs=opus',
        fileLength: '12345',
        seconds: 7,
        ptt: true,
      },
    },
    messageType: 'audioMessage',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const ownMessage = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '100000000000001@lid',
      fromMe: true,
      id: 'TESTMSG00000003',
      remoteJidAlt: '5511900000001@s.whatsapp.net',
      addressingMode: 'lid',
      participant: '',
    },
    pushName: 'Contato Teste',
    message: {
      conversation: 'Já te respondo!',
    },
    messageType: 'conversation',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const groupMessage = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '120363000000000001@g.us',
      fromMe: false,
      id: 'TESTMSG00000004',
      participant: '100000000000002@lid',
    },
    pushName: 'Contato Teste',
    message: {
      conversation: 'Bom dia, grupo',
    },
    messageType: 'conversation',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const newsletterMessage = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '120363000000000002@newsletter',
      fromMe: false,
      id: 'TESTMSG00000005',
    },
    pushName: 'Contato Teste',
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'Novidade do canal',
      },
    },
    messageType: 'imageMessage',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const contactImage = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: '100000000000001@lid',
      fromMe: false,
      id: 'TESTMSG00000006',
    },
    pushName: 'Contato Teste',
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'Olha essa foto',
      },
    },
    messageType: 'imageMessage',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const statusMessage = {
  event: 'messages.upsert',
  instance: 'store',
  data: {
    key: {
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'TESTMSG00000007',
      participant: '100000000000001@lid',
    },
    pushName: 'Contato Teste',
    message: {
      conversation: 'Meu status',
    },
    messageType: 'conversation',
    messageTimestamp: 1795800000,
    instanceId: '00000000-0000-4000-8000-000000000001',
    source: 'android',
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const call = {
  event: 'call',
  instance: 'store',
  data: [
    {
      id: 'TESTCALL0001',
      from: '100000000000001@lid',
      chatId: '100000000000001@lid',
      date: '2026-11-27T12:00:00.000Z',
      status: 'offer',
      isVideo: false,
      isGroup: false,
      offline: false,
    },
  ],
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};

export const connectionUpdate = {
  event: 'connection.update',
  instance: 'store',
  data: {
    instance: 'store',
    state: 'open',
    statusReason: 200,
  },
  destination: 'https://agent-desk.example/webhooks/evolution',
  date_time: '2026-11-27T12:00:00.000Z',
  sender: '5511900000000@s.whatsapp.net',
  server_url: 'https://evolution.example',
  apikey: 'fake-instance-api-key',
};
