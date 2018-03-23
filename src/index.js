import RemoteDev from 'remotedev';

const remotedev = RemoteDev.connectViaExtension();

const toAction = msg => {
  const type = msg => (msg && msg.ctor ? `${msg.ctor}:${type(msg._0)}` : '');
  return {
    type: type(msg).slice(0, -1),
    ...msg,
  };
};

export const send = (msg, model) => {
  const action = toAction(msg);
  const state = model;
  remotedev.send(action, state);
};
