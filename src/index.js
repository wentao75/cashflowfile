const { Command, flags } = require("@oclif/command");
const _ = require("lodash");
const fs = require("fs");
const csv = require("fast-csv");
const { option } = require("@oclif/command/lib/flags");

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
            headers: [
                "pool",
                "customer",
                "project",
                "period",
                "sales",
                "department",
                "loan",
                "loanDate",
                "transactionAmount",
                "transactionDate",
            ],
            renameHeaders: true,
        };

        fs.createReadStream(filename)
            .pipe(csv.parse(options))
            .on("error", (error) => this.log(error))
            .on("data", (row) => {
                if (row) {
                    if ("period" in row) {
                        row.period = _.parseInt(row.period);
                    }
                    if ("loan" in row) {
                        row.loan = _.toNumber(
                            _.trim(_.replace(row.loan, /,/g, ""))
                        );
                    }
                    if ("transactionAmount" in row) {
                        row.transactionAmount = _.toNumber(
                            _.replace(_.trim(row.transactionAmount), /,/g, "")
                        );
                    }
                    if ("loanDate" in row) {
                        row.loanDate = _.trim(row.loanDate); // Date.parse(row.date);
                    }
                    if ("transactionDate" in row) {
                        row.transactionDate = _.trim(row.transactionDate); // Date.parse(row.transactionDate);
                    }
                    data.push(row);
                }
                // this.log(row);
            })
            .on("end", (rowCount) => {
                this.log(`共读取${rowCount}行`);
                this.log(JSON.stringify(data));
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
