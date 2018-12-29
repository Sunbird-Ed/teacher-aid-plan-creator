import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-teaching-pack',
  templateUrl: './create-teaching-pack.component.html',
  styleUrls: ['./create-teaching-pack.component.css']
})
export class CreateTeachingPackComponent implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }
  padagogyFlow: any;

  ngOnInit() {
    this.padagogyFlow = {
      "ownershipType": ["createdBy"],
      "code": "org.sunbird.x9u5AH",
      "keywords": ["pedagogyflow", "delhi"],
      "subject": "Mathematics",
      "channel": "in.ekstep",
      "description": "New Delhi Follow 4 step Pedagogy Flow. Here is the description about the same.",
      "language": ["English"],
      "medium": "English",
      "mimeType": "application/vnd.ekstep.h5p-archive",
      "idealScreenSize": "normal",
      "createdOn": "2018-12-19T18:06:47.653+0000",
      "objectType": "Content",
      "gradeLevel": ["KG"],
      "appId": "local.sunbird.portal",
      "contentDisposition": "inline",
      "lastUpdatedOn": "2018-12-19T18:06:47.653+0000",
      "contentEncoding": "gzip",
      "pedagogySteps": "{\"step1\":\"Introduction\",\"step2\":\"Engagement\",\"step3\":\"Questioning\",\"step4\":\"Feedback\"}",
      "dialcodeRequired": "No",
      "contentType": "PedagogyFlow",
      "identifier": "do_21265862908030156813008",
      "audience": ["Learner"],
      "IL_SYS_NODE_TYPE": "DATA_NODE",
      "visibility": "Default",
      "os": ["All"],
      "consumerId": "4c4cc779-589b-4791-b810-22b79dd65ebd",
      "pedagogyStep": ["Introduction", "Engagement", "Questioning", "Feedback"],
      "mediaType": "content",
      "osId": "org.ekstep.quiz.app",
      "graph_id": "domain",
      "nodeType": "DATA_NODE",
      "versionKey": "1545242807653",
      "idealScreenDensity": "hdpi",
      "framework": "NCF",
      "createdBy": "54893ee2-961b-445a-9013-77afb3e9c83f",
      "compatibilityLevel": 1,
      "IL_FUNC_OBJECT_TYPE": "Content",
      "name": "Delhi Pedagogy Flow",
      "IL_UNIQUE_ID": "do_21265862908030156813008",
      "board": "CBSE",
      "status": "Draft",
      "node_id": 440827
    };
  }
  addNewMethod() {
    this.router.navigate(['workspace/new/teachingpack/do_12345/teachingmethod']);
  }
}
