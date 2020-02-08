import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class CrawlerService {
	constructor(@InjectQueue("parse") private readonly queue: Queue) {}
}
