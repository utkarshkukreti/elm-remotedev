import RemoteDev from 'remotedev';

const remotedev = RemoteDev.connectViaExtension();

export const send = (msg, model) => {
  const action = msg;
  const state = model;
  remotedev.send(action, state);
};
