const render = (scriptUrl, lobbyId) => (
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Captain Sonar</title>
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

export default render;