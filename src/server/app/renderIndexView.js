export default () => (
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Commander Periscope</title>
    <script>
      window.NODE_ENV = ${JSON.stringify(process.env.NODE_ENV)};
    </script>
    <script src="/index.js"></script>
  </head>
  <body>
  </body>
</html>
`);
