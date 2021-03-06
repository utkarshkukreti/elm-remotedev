# elm-remotedev

This project contains code that allows you to intercept calls to your Elm App's
`update` function and send the message and model to the
[Redux DevTools Extension][redux-devtools-extension].

## Demo

![Demo GIF](https://cdn.rawgit.com/utkarshkukreti/83520da614940ef26b68e4f456b563c3/raw/d9130e1a09181dea9c655d107c3ff55aacb1b1a7/a.gif)

## Usage

### Elm 0.18 / elm-lang/core 5.x.x

Running this with Elm 0.18 requires a one line patch to the JS code of Elm's
`elm-lang/core` package.

1.  Install the Redux DevTools extension for [Firefox][firefox-extension] or
    [Google Chrome][google-chrome-extension].

2.  Open `elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Platform.js` and
    around line 120, just below `model = results._0;`, add the following line:

    ```
    typeof ElmRemoteDev !== 'undefined' && ElmRemoteDev.send(msg, model);
    ```

    Your code should now look like:

    ```
    ...
    model = results._0;
    typeof ElmRemoteDev !== 'undefined' && ElmRemoteDev.send(msg, model);
    updateView(model);
    ...
    ```

3.  Include the following script in your page, preferably before you mount your
    application:

    ```
    <script src="https://cdn.rawgit.com/utkarshkukreti/elm-remotedev/master/dist/main.js"></script>
    ```

Now recompile your app and reload it in your browser and you'll see every call
to `update` being logged in the extension window.

[redux-devtools-extension]: https://github.com/zalmoxisus/redux-devtools-extension
[firefox-extension]: https://addons.mozilla.org/en-US/firefox/addon/remotedev/
[google-chrome-extension]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
