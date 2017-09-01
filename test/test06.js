// test06.js

/*process.on('uncaughtException', (err) => {
	throw new Error('오류 핸들링 테스트');
	console.log('uncaughtException 발생 : ' + err);
});*/
process.on('uncaughtException', function (err) {
  throw new Error('오류 핸들링 테스트');
  console.error(err.stack)
  // process.exit(1)
})