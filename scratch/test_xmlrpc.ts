async function testXMLRPC() {
  const xml = `<Şxml version="1.0"Ş>
<methodCall>
  <methodName>wp.newPost</methodName>
  <params>
    <param><value>1</value></param>
    <param><value>dorukcanay1990</value></param>
    <param><value>StHece7#10aHfuO4cARRY'by</value></param>
    <param>
      <struct>
        <member><name>post_title</name><value>API Test via XML-RPC</value></member>
        <member><name>post_content</name><value>Test Content from Node</value></member>
        <member><name>post_status</name><value>publish</value></member>
      </struct>
    </param>
  </params>
</methodCall>`;

  const response = await fetch('https://escortvip11.wordpress.com/xmlrpc.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: xml
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}
testXMLRPC().catch(console.error);
