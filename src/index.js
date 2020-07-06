const { Command, flags } = require("@oclif/command");
const _ = require("lodash");
const fs = require("fs");
const csv = require("fast-csv");
// const { option } = require("@oclif/command/lib/flags");

class CashflowfileCommand extends Command {
    async run() {
        const { args } = this.parse(CashflowfileCommand);
        const filename = args.file;
        this.log(`读取文件: ${filename} ...`);
        if (_.isEmpty(filename)) {
            this.error("没有给文件，退出！");
            this.exit();
            return;
        }

        // 打开读取文件，转化为需要的json格式并打印
        let data = [];

        let options = {
            // headers: [
            //     "pool",
            //     "customer",
            //     "project",
            //     "period",
            //     "sales",
            //     "department",
            //     "loan",
            //     "loanDate",
            //     "transactionAmount",
            //     "transactionDate",
            // ],
            // 众贡
            // headers: [
            //     "customer",
            //     "project",
            //     "period",
            //     "sales",
            //     "department",
            //     "invoice",
            //     "loan",
            //     "loanDate",
            //     undefined, // "客户需求金额",
            //     "transactionDate",
            //     undefined, // "资金余额"",
            //     "returnDate",
            //     "writeOffAmount", // "核销金额",
            //     undefined, // "核销日期",
            //     undefined, // "回款周期",
            //     undefined, // "核销周期"
            //     undefined, // "识别码",
            //     undefined, // "逾期",
            //     undefined, // "数列计算",
            // ],
            // 华瑞
            // headers: [
            //     "customer",
            //     "project",
            //     "period",
            //     "sales",
            //     "department",
            //     "loan",
            //     "loanDate",
            //     undefined, // "客户需求金额",
            //     "transactionDate",
            //     undefined, // "资金余额"",
            //     "returnDate",
            //     "writeOffAmount", // "核销金额",
            //     undefined, // "回款周期",
            //     undefined, // "识别码",
            //     undefined,
            // ],
            // 中建
            // headers: [
            //     "commission",
            //     "sales",
            //     "customer",
            //     "project",
            //     undefined, // "transaction",
            //     undefined,
            //     "transactionDate",
            //     "writeOffAmount", // "结算金额",
            //     "deadline", // "回款止日"
            //     undefined, // "核销日期",
            //     "loan", // "客户需求金额",
            //     "returnDate",
            //     undefined,
            //     undefined,
            // ],
            // 欧飞
            headers: [
                "customer",
                "project",
                "period",
                "sales",
                "department",
                "loan",
                "loanDate",
                undefined, // "客户需求金额",
                "transactionDate",
                undefined, // "资金余额"",
                "returnDate",
                "writeOffAmount", // "核销金额",
                undefined, // "核销日期",
                undefined, // "回款周期",
                undefined, // "识别码",
                undefined, // "采购商品",
                undefined, // "面值",
            ],
            renameHeaders: true,
            // ignoreEmpty: true,
        };

        fs.createReadStream(filename)
            .pipe(csv.parse(options))
            .transform((data) => {
                // this.log("before: %o", data);
                data.pool = "欧飞"; // "中建"; // "众贡"; // "华瑞";
                data.period = _.parseInt(data.period);
                data.loan = _.toNumber(_.trim(_.replace(data.loan, /,/g, "")));
                data.loanDate = _.trim(data.loanDate);
                data.transactionDate = _.trim(data.transactionDate);
                data.returnDate = _.trim(data.returnDate);
                data.writeOffAmount = _.toNumber(
                    _.trim(_.replace(data.writeOffAmount, /,/g, ""))
                );
                // this.log("end: %o", data);
                return data;
            })
            .on("error", (error) => this.log(error))
            .on("data", (row) => {
                // if (row) {
                //     if ("period" in row) {
                //         row.period = _.parseInt(row.period);
                //     }
                //     if ("loan" in row) {
                //         row.loan = _.toNumber(
                //             _.trim(_.replace(row.loan, /,/g, ""))
                //         );
                //     }
                //     if ("transactionAmount" in row) {
                //         row.transactionAmount = _.toNumber(
                //             _.replace(_.trim(row.transactionAmount), /,/g, "")
                //         );
                //     }
                //     if ("loanDate" in row) {
                //         row.loanDate = _.trim(row.loanDate); // Date.parse(row.date);
                //     }
                //     if ("transactionDate" in row) {
                //         row.transactionDate = _.trim(row.transactionDate); // Date.parse(row.transactionDate);
                //     }
                data.push(row);
                // }
                // this.log(row);
            })
            .on("end", (rowCount) => {
                this.log(`共读取${rowCount}行`);
                this.log(JSON.stringify(data, null, "  "));
            });
    }
}

CashflowfileCommand.description = `Describe the command here
...
Extra documentation goes here
`;

CashflowfileCommand.flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    // add --help flag to show CLI version
    help: flags.help({ char: "h" }),
    // name: flags.string({char: 'n', description: 'name to print'}),
};

CashflowfileCommand.args = [
    { name: "file", require: true, description: "处理文件" },
];
module.exports = CashflowfileCommand;
