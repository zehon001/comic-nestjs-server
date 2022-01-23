import JSZip from 'jszip'

import FileSaver from 'file-saver'
import {basename} from 'path'

import axios from "axios";

export class FileSaverUtil {
    static title:string = "";
    /**文件打包
     * arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
     * filename 压缩包名
     * */
    static filesToRar(arrImages, filename) {
        if(typeof arrImages[0] == 'string'){
            this.downloadIamge(arrImages[0]);
            return;
            arrImages = arrImages.map(img=>{return {fileUrl:img, renameFileName:basename(img)}});
        }
        console.log(arrImages);
        let _this = this;
        let zip = new JSZip();
        let cache = {};
        let promises = [];
        _this.title = '正在加载压缩文件';
        console.log("正在加载压缩文件");
        for (let item of arrImages) {
            const promise:any = _this.getImgArrayBuffer(item.fileUrl).then(data => {
                // 下载文件, 并存成ArrayBuffer对象(blob)
                zip.file(item.renameFileName, data as any, { binary: true }); // 逐个添加文件
                cache[item.renameFileName] = data;
            });
            promises.push(promise);
        }
        Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then(content => {
                _this.title = '正在压缩';
                console.log("正在压缩");

                // 生成二进制流
                FileSaver.saveAs(content, filename); // 利用file-saver保存文件 自定义文件名
                _this.title = '压缩完成';
                console.log("压缩完成");
            });
        }).catch(res => {
            console.log("文件压缩失败");
            //_this.$message.error('文件压缩失败');
        });
    }
    //获取文件blob
    static getImgArrayBuffer(url) {
        let _this = this;
        return new Promise((resolve, reject) => {
            //通过请求获取文件blob格式
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.responseType = "blob";
            xmlhttp.onload = function () {
                if (this.status == 200) {
                    resolve(this.response);
                } else {
                    reject(this.status);
                }
            }
            xmlhttp.send();
        });
    }

    static downloadIamge (imgsrc, name?) { // 下载图片地址和图片名

        // axios({
        //     method:"get",
        //     url:imgsrc,
        //     responseType:"blob",
        // }).then((response)=>{
        //     console.log(response);
        // }).catch((err)=>console.error(err));
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous")
        image.onload = function() {
          let canvas = document.createElement("canvas")
          canvas.width = image.width
          canvas.height = image.height
          let context = canvas.getContext("2d")
          if(context)context.drawImage(image, 0, 0, image.width, image.height)
          let url = canvas.toDataURL("image/png") //得到图片的base64编码数据
          let a = document.createElement("a") // 生成一个a元素
          let event = new MouseEvent("click") // 创建一个单击事件
          a.download = name || "photo" // 设置图片名称
          a.href = url // 将生成的URL设置为a.href属性
          a.dispatchEvent(event) // 触发a的单击事件
        }
        image.src = imgsrc
        
      }

}
