import { TeachingPackService } from '../../services';
import { ConfigService } from '@sunbird/shared';
import { ReflectiveInjector } from '@angular/core';
import { Injector } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule } from "@angular/http";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MyUploadAdapter {
    http: any;
    loader: any;
    url: any;
    xhr: any;
    teachingPackService: TeachingPackService;
    configService: ConfigService;
    // teachingPackService: any;
    // configService: any;
    constructor(
        loader,
        teachingPackService,
        configService
    ) {
        // MyUploadAdapter.http = this.http;
        this.loader = loader;
        // this.configService = new ConfigService();
        // const providers = (<any>HttpModule).decorators[0].args[0].providers;
        // const injector = ReflectiveInjector.resolveAndCreate(providers);
        // this.http = injector.get(Http);
        // const injector2 = ReflectiveInjector.resolveAndCreate([this.configService, providers]);
        // this.teachingPackService = injector2.get(TeachingPackService);
        // const injector2 = Injector.create([
        //     { useClass: ConfigService, provide: ConfigService, deps: [this.http] }
        // ]);
        // this.configService = injector2.get(ConfigService);
        // console.log('urlll', this.configService.urlConFig.URLS.CONTENT.UPLOAD_IMAGE);
        // this.teachingPackService = new TeachingPackService(this.configService, this.http);
    } 
    upload() {
        this.createContent();
        // return new Promise((resolve, reject) => {
        //     this._initRequest();
        //     this._initListeners(resolve, reject);
        //     this._sendRequest();
        // });
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // the POST request with JSON as a data structure but your configuration
        // could be different.
        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file:' + ` ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve({
                default: response.url
            });
        });

        // Upload progress when it is supported. The FileLoader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest() {
        // Prepare the form data.
        const data = new FormData();
        data.append('upload', this.loader.file);

        // Send the request.
        this.xhr.send(data);
    }
    createContent() {
        const req = {
            url: 'action/content/v3/create',
            data: {
                'request': {
                    content: {
                        name: 'New Image',
                        contentType: 'Asset',
                        mediaType: 'mediaType',
                        mimeType: 'image/png',
                        createdBy: '3dcabadc-58e5-4b78-adb7-0013e5b5306b'
                    }
                }
            }
        };
        this.teachingPackService.post(req).subscribe((res) => {
            console.log('media upload object ', res);
            const imgId = res['result'].node_id;
            const imagedata = new FormData();
            imagedata.append('file', this.loader.file);
            const request = {
                url: `${this.configService.urlConFig.URLS.CONTENT.UPLOAD_IMAGE}/${imgId}`,
                data: {
                    imagedata
                }
            };

            this.teachingPackService.post(request).subscribe((response) => {
                console.log('media upload ', response);
            });
        });
        // {
        //     'request':
        //     {
        //         'content':
        //         {
        //             "name": 'Screenshot from 2018-11-12 15-14-16',
        //                 'creator': 'ABTC New',
        //                     'createdBy': '3dcabadc-58e5-4b78-adb7-0013e5b5306b',
        //                         'code': 'org.ekstep0.807443237213088',
        //                             'mimeType': 'image/png', 'mediaType': 'image',
        //                                 'contentType': 'Asset', 'osId':
        //             'org.ekstep.quiz.app', 'language': ['English']
        //         }
        //     }
        // }

    }
    linkImage() {

    }
}
