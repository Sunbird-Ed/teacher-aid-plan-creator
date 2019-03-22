export class UploadAdapter {
    loader: any;
    config: any;
    teacher: any;
    formData: any;
    userProfile: any;
    constructor(config, teachingPackService, userProfile, loader) {
        this.loader = loader;
        this.config = config;
        this.teacher = teachingPackService;
        this.userProfile = userProfile;
    }
    upload() {
        return new Promise((resolve, reject) => {
            this.createContent(resolve, reject);
        });
    }
    createContent(resolve, reject) {
        const formData: FormData = new FormData();
        formData.append('file', this.loader.file);
        const fileType = this.loader.file.type;
        const fileName = this.loader.file.name;
        this.formData = formData;
        const req = {
            url: this.config.urlConFig.URLS.CONTENT.CREATE_CONTENT,
            data: {
                'request': {
                    content: {
                        name: fileName,
                        contentType: 'Asset',
                        mediaType: 'image',
                        mimeType: fileType,
                        createdBy: this.userProfile.userId,
                        language: ['English'],
                        creator: `${this.userProfile.firstName} ${this.userProfile.lastName ? this.userProfile.lastName : ''}`,
                        code: 'org.ekstep0.5375271337424472',
                    }
                }
            }
        };
        this.teacher.post(req).subscribe((res) => {
            const imgId = res['result'].node_id;
            const request = {
                url: `${this.config.urlConFig.URLS.CONTENT.UPLOAD_IMAGE}/${imgId}`,
                data: this.formData
            };
            this.teacher.post(request).subscribe((response) => {
                resolve({
                    default: response.result.content_url
                });
            });
        });
    }
}