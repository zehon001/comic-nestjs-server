import { Injectable, Inject } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { ParserService } from "@app/parser";
import AppDF from "../app.define";
import MyLogger from "utils/MyLogger";
import { Job } from "bull";

@Injectable()
export class CrawlertaskService {
	private logger: MyLogger;
	constructor(
		@Inject(ParserService) private readonly parserService: ParserService,
		@InjectQueue(AppDF.PARSE_QUEUE) private readonly queue: Queue
	) {
		this.logger = new MyLogger("CrawlertaskService");
		this.logger.warn(this.parserService.toString());
		this.queue.process(this.queueProcess.bind(this));
	}

	private async queueProcess(job: Job<any>, jobDone) {
		// this.logger.warn(this.parserService.toString());
		// console.log("Job done by worker" + job.id + job.data);
		// return;
		console.log("Job done by worker", job.id, job.data);
		let progress = 0;

		const { comic, err } = await this.parserService.parseComicByUrl(job.data.parseUrl);
		if (err) {
			await job.moveToFailed({ message: "解析失败" });
			return;
		}

		job.data.name = comic.name;
		console.log(`解析漫画完成:${comic.name},分集数:${comic.seasons.length}`);
		if (!job.data.status) job.data.status = {};
		await job.update(job.data);
		progress += 5;
		await job.progress(progress);

		await this.delay(1000); //延迟一秒

		const seasons = comic.seasons.concat([]); //拷贝数组
		const step = 95 / seasons.length;
		//跳过已完成任务
		for (let i = seasons.length - 1; i >= 0; i--) {
			let s_id = seasons[i].toString();
			if (job.data.status[s_id] == "success") {
				seasons.splice(i, 1);
				progress += step;
			}
		}
		await job.progress(Math.floor(progress));

		for (let i = 0; i < seasons.length; i++) {
			console.log(`正在解析第${i + 1}集`);
			// console.log(seasons[i]);
			let s_id = seasons[i].toString();
			let { err, season } = await this.parserService.parseSeasonById(s_id);
			if (err) {
				console.log(`解析第${i + 1}集失败`);
				job.data.status[s_id] = "fail";
			} else {
				console.log(`解析第${i + 1}集完成,漫画页数:${season.images ? season.images.length : 0}`);
				job.data.status[s_id] = "success";
				progress += step;
				await job.progress(Math.floor(progress));
			}
			await job.update(job.data);
			console.log(`等待 1 秒`);
			await this.delay(1000);
		}
		if (progress >= 99.99) {
			progress = 100;
			await job.progress(progress);
		}
		console.log(`漫画 ${comic.name} 解析完成`);
		jobDone();
	}

	async delay(time: number) {
		return new Promise(function(resolve, reject) {
			setTimeout(resolve, time);
		});
	}

	/**过滤任务 */
	private async filterJob(job: Job<any>) {
		if (job)
			return {
				id: job.id,
				state: await job.getState(),
				data: job.data,
				progress: await job.progress(),
				processedOn: job.processedOn || 0,
				finishedOn: job.finishedOn || 0
			};
		else return {};
	}

	//增
	async create(data) {
		return this.filterJob(await this.queue.add(data));
	}
	//删
	async remove(id: string) {
		const job = await this.queue.getJob(id);
		if (job) {
			if (await job.isActive()) {
				await job.moveToFailed({ message: "主动删除" });
			}
			await job.remove();
		}
		// job && (await job.remove());
		return this.filterJob(job);
	}
	//改
	async modify(id: string, data: any) {
		const job = await this.queue.getJob(id);
		if (job) {
			if (!(await job.isActive())) {
				await job.update(data);
			}
		}
		return this.filterJob(job);
	}
	//查
	async findOne(id: string) {
		const job = await this.queue.getJob(id);
		return this.filterJob(job);
	}
	//列表
	async find(page?: number, limit?: number) {
		let counts = await this.queue.getJobCounts();
		let count = counts.active + counts.completed + counts.delayed + counts.failed + counts.waiting;
		page = page || 1;
		limit = limit || count;
		let start = (page - 1) * limit;
		let end = start + limit - 1;

		const jobs: any[] = await this.queue.getJobs([], start, end, true);
		// console.log(jobs);
		for (let i = 0; i < jobs.length; i++) {
			// console.log(jobs[i].id);
			jobs[i] = await this.filterJob(jobs[i]);
		}
		return {
			total: count,
			data: jobs,
			lastPage: Math.ceil(count / limit),
			page: page
		};
	}

	//重试
	async retry(id: string) {
		const job = await this.queue.getJob(id);
		if (job) {
			let state = (await job.getState()).toString();
			if (state != "active" && state != "completed") {
				await job.retry();
			}
			// if (!(await job.isActive())&&(await job.getState()) {
			// }
		}
		return this.filterJob(job);
	}
}
