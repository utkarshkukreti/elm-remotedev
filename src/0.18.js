import RemoteDev from 'remotedev';

const remotedev = RemoteDev.connectViaExtension();

const toAction = msg => {
  const type = msg => (msg && msg.ctor ? `${msg.ctor}:${type(msg._0)}` : '');
  return {
    type: type(msg).slice(0, -1),
    ...toJs(msg),
  };
};

const toJs = model => {
  try {
    if (model && typeof model === 'object') {
      switch (model.ctor) {
        // Empty List.
        case '[]':
          return [];
        // Non-empty List.
        case '::': {
          const array = [];
          let head = model;
          while (head.ctor === '::') {
            array.push(toJs(head._0));
            head = head._1;
          }
          return array;
        }
        // Set
        case 'Set_elm_builtin': {
          const array = [];
          const recur = node => {
            // Empty node.
            if (node.ctor === 'RBEmpty_elm_builtin') {
              return;
            }
            // Left child.
            recur(node._3);
            // Self.
            array.push(toJs(node._1));
            // Right child.
            recur(node._4);
          };
          recur(model._0);
          return {$: 'Set', ...array};
        }
        // Dict
        case 'RBNode_elm_builtin': {
          const array = [];
          const recur = node => {
            // Empty node.
            if (node.ctor === 'RBEmpty_elm_builtin') {
              return;
            }
            // Left child.
            recur(node._3);
            // Self.
            array.push({key: toJs(node._1), value: toJs(node._2)});
            // Right child.
            recur(node._4);
          };
          recur(model);
          return {$: 'Dict', ...array};
        }
        // A record.
        default:
          // If a record only contains one field named '_0' and that field doesn't
          // have a ctor, collapse the object.
          // This collapses a lot of unnecessary nesting created by types like:
          // type Msg = FooMsg Foo.Msg | BarMsg Bar.Msg | BazMsg Baz.Msg
          if (
            '_0' in model &&
            'ctor' in model &&
            Object.keys(model).length == 2 &&
            typeof model._0 === 'object' &&
            !('ctor' in model._0)
          ) {
            return {
              $$: model.ctor,
              ...toJs(model._0),
            };
          }

          const object = {};
          for (const key in model) {
            object[key === 'ctor' ? '$' : key] = toJs(model[key]);
          }
          return object;
      }
    }
    return model;
  } catch (error) {
    return `!!! ERROR: ${error} !!!`;
  }
};

export const send = (msg, model) => {
  const action = toAction(msg);
  const state = toJs(model);
  remotedev.send(action, state);
};
