
export enum StatusEnum {
	Pending = 'PENDENTE',
	InProgress = 'EM ANDAMENTO',
	Completed = 'CONCLUÍDA'
}

export class Task {
	id!: string;
	title!: string;
	description!: string;
	status?: StatusEnum;
	created!: Date;
	completionDate!: Date;
	lastEdit!: Date;

	constructor(init?: Partial<Task>) {
		if (init) {
			Object.assign(this, init);
		}
	}

}