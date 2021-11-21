/**
 * 1. 查询到漫画章节页（如：https://www.copymanga.com/comic/jhzstssldrs/chapter/010692c2-0f04-11e9-ada7-00163e0ca5bd）
 * 2. 找到HTML ,查找class为imageData的div, 获取contentKey，
 *          <script>
              var jojo = 'xxxmanga.woo.key';这个是下面加密的key 就在html里
            </script>
 * 
 * 3. 解密代码是这个脚本 https://alicdn2.mangafunc.fun:12001/static/websitefree/js20190704/comic_content_pass20210926.js
 * 
 * 翻译前：
 * var _0x4a994a = _0x4d40da(0x6),
                _0x219d42 = document[_0x4080('0xd')]('.imageData')['getAttribute']('contentKey'),
                _0x20876d = document[_0x4080('0xd')]('.comicIndex'),
                _0x47198b = document[_0x4080('0xd')](_0x4080('0x5')),
                _0x174a41 = _0x219d42['substring'](0x0, 0x10),
                _0x19b13b = _0x219d42['substring'](0x10, _0x219d42[_0x4080('0x2')]),
                _0x1f78df = _0x4a994a[_0x4080('0x2c')][_0x4080('0x32')][_0x4080('0x21')](jojo),
                _0x36bb4a = _0x4a994a[_0x4080('0x2c')][_0x4080('0x32')]['parse'](_0x174a41),
                _0x203e94 = function(_0x4b8db3) {
                    var _0x403d3b = _0x4a994a[_0x4080('0x2c')][_0x4080('0x7')][_0x4080('0x21')](_0x4b8db3),
                        _0x46734d = _0x4a994a[_0x4080('0x2c')][_0x4080('0xf')]['stringify'](_0x403d3b);
                    return _0x4a994a['AES'][_0x4080('0xe')](_0x46734d, _0x1f78df, {
                        'iv': _0x36bb4a,
                        'mode': _0x4a994a[_0x4080('0x22')]['CBC'],
                        'padding': _0x4a994a[_0x4080('0x19')]['Pkcs7']
                    })['toString'](_0x4a994a['enc'][_0x4080('0x32')])[_0x4080('0x29')]()
                }(_0x19b13b),
                _0x12237a = JSON[_0x4080('0x21')](_0x203e94),
                _0x5a25ac = document[_0x4080('0xd')](_0x4080('0xb')),
                _0x3f2aec = 0x0;
    翻译后：
    var crypto = _0x4d40da(0x6),
                imgData = document.querySelector(".imageData").getAttribute(contentKey),
                comicIndex = document.querySelector('.comicIndex'),
                comicCount = document.querySelector(".comicCount"),
                cryptoKey = imgData.substring(0, 16),
                cryptoData = imgData.substring(16, imgData.length),
                mKey = crypto.enc.Utf8.parse("xxxmanga.woo.key"),
                cryptoIv = crypto.enc.Utf8.parse(cryptoKey),
                decryptData = function(data) {
                    var hexData = crypto.enc.Hex.parse(data),
                    hexDataBase64 = crypto.enc.Base64.stringify(hexData);
                    return crypto.AES.decrypt(hexDataBase64, mKey, {
                        'iv': cryptoIv,
                        'mode': crypto.mode.CBC,
                        'padding': crypto.pad.Pkcs7
                    }).toString(crypto.enc.Utf8).toString()
                }(cryptoData),
                decryptImageData = JSON.parse(decryptData),
                _0x5a25ac = document[_0x4080('0xd')](_0x4080('0xb')),
                _0x3f2aec = 0x0;
 */