<template>
	<avue-crud
		ref="crud"
		:data="data.data"
		:option="option"
		:page="page"
		@row-save="create"
		@row-update="update"
		@row-del="remove"
		@search-change="search"
		@on-load="changePage"
		@sort-change="changeSort"
	>
		<template slot="menuLeft">
			<el-button
				@click="removeSelected"
				type="danger"
				size="small"
				v-if="option.selection"
				>删除选中</el-button
			>
		</template>
	</avue-crud>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ResourcesCrud extends Vue {
	@Prop(String) resource!: string;
	/**表格数据*/
	data = [];

	/**表格配置(服务器拉取)*/
	option: any = {};
	//分页数据
	page = {
		pageSize: 10,
		total: 10
	};

	/**数据库查询参数 */
	query: any = {
		// limit: 2
	};

	/**刷新数据 */
	async fetch() {
		const res = await this.$http.get(this.resource, {
			params: {
				query: this.query
			}
		});
		this.data = res.data;
		this.page.total = res.data.total;
	}
	/**拉取配置信息 */
	async fetchOption() {
		const res = await this.$http.get(`${this.resource}/option`);
		this.option = res.data;
	}

	/**新建一条数据 */
	async create(row, done, loading) {
		await this.$http.post(this.resource, row);
		this.$message.success("新建成功");
		this.fetch();
		done();
	}
	/**更新一条数据 */
	async update(row, index, done, loading) {
		const data = JSON.parse(JSON.stringify(row));
		delete data.$index;
		await this.$http.put(`${this.resource}/${data._id}`, data);
		this.$message.success("编辑成功");
		this.fetch();
		done();
	}
	/**删除一条数据 */
	async remove(row, index) {
		try {
			await this.$confirm("是否确认删除?");
		} catch (err) {
			return;
		}
		await this.$http.delete(`${this.resource}/${row._id}`);
		this.$message.success("删除成功");
		this.fetch();
	}
	async removeSelected() {
		const crud = this.$refs.crud as any;
		if (crud.tableSelect.length <= 0) return;
		try {
			await this.$confirm(
				`是否确认删除选中的${crud.tableSelect.length}项?`
			);
		} catch (err) {
			return;
		}
		const loading = this.$loading({
			lock: true,
			text: "正在删除"
		});
		for (let i = 0; i < crud.tableSelect.length; i++) {
			const _id = crud.tableSelect[i]._id;
			await this.$http.delete(`${this.resource}/${_id}`);
		}
		loading.close();
		this.$message.success("删除成功");
		this.fetch();
		// await this.$http.delete(`${this.resource}/${row._id}`);
		// this.$message.success("删除成功");
		// this.fetch();
	}

	/**搜索改变 */
	search(where, done) {
		for (let k in where) {
			const field = this.option.column.find(v => v.prop === k);
			if (field.regex) where[k] = { $regex: where[k] };
		}
		this.query.where = where;
		this.fetch();
		done();
	}

	/**排序改变 */
	changeSort({ prop, order }) {
		// console.log(params);
		if (!order) this.query.sort = null;
		else {
			this.query.sort = {
				[prop]: order === "ascending" ? 1 : -1
			};
		}
		this.fetch();
	}

	/**分页改变 */
	async changePage({ currentPage, pageSize }) {
		this.query.page = currentPage;
		this.query.limit = pageSize;
		this.fetch();
	}

	created() {
		this.query.limit = this.page.pageSize;
		this.fetchOption();
		this.fetch();
	}
}
</script>

<style>
</style>