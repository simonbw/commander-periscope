// TODO: Minify this
export default (scriptUrl, lobbyId) => (
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Commander Periscope</title>
    <script>
      window._servedFromExpress = true;
      ${lobbyId ? `window._lobbyId = '${lobbyId}';` : ''}
    </script>
    <script src="${scriptUrl}"></script>
  </head>

  <body>
  </body>
</html>
`);
