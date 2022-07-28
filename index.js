//core module
const fs = require("fs")
const path = require("path")
//modulo externo
const chalk = require("chalk")
const inquirer = require("inquirer")
const { identity } = require("lodash")

operation()
function operation () {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar Conta",
            "Consultar Saldo",
            "Depositar",
            "Sacar",
            "Sair"
        ]
    }])
    .then(res => {
        if(res.action === "Criar Conta"){
            createAccount()
            buildAccount()
        }

        else if(res.action === "Consultar Saldo"){
            balance()

        }

        else if(res.action === "Depositar"){
            deposit()
        }

        else if(res.action === "Sacar"){
            withdraw()
        }

        else if(res.action = "Sair") {
            console.log(chalk.green("Obrigado! Conte conosco e volte sompre"))
            process.exit()
        }
    })//a resposta vem como um obj: {action: sacar}(por exemplo), res.action = sacar
    .catch(error => console.log(error))

}

function createAccount(){
    console.log(chalk.bgGreen("Parabéns por escolher o nosso banco"))
    console.log(chalk.green("Digite o nome que deseja para a sua conta"))
}

function buildAccount() {
    inquirer.prompt({
        name: "p",
        message: "Qual nome você deseja para a sua conta?"
    })
    .then(res => {
        if(!fs.existsSync("contas")){
            fs.mkdirSync("contas")
        }

        if(fs.existsSync(`contas/${res.p}.json`)){
            console.log(chalk.red("Uma conta com esse nome já foi criada. Escolha outro"))
            buildAccount()
            return
            
            
        }

        if(!fs.existsSync(`contas/${res.p}.json`)){
            fs.writeFileSync(`contas/${res.p}.json`, `{"balance": 0}`, (error) => {
                console.log(error)
            })
        }
        console.log(chalk.green("Conta criada com Sucesso"))
        operation()
    })
    .catch(error => console.log(error))
}

function balance(){
    inquirer.prompt({
        name: "p",
        message: "Digite o nome da conta"
    })
    .then(res => {
        if(!fs.existsSync(`contas/${res.p}.json`)){
            console.log(chalk.red("A conta não existe"))
            balance()
            return
        } 
        const valueBalance = countBalance(res.p)

        if(valueBalance >= 0) {
            console.log(`O seu saldo é de: R$ ${chalk.green(valueBalance)}`)
        } else {
            console.log(`O seu saldo é de: R$ ${chalk.red(valueBalance)}`)
        }
    })
    .catch(err => console.log(err))
}

function deposit(){
    inquirer.prompt({
        name: "p",
        message: "Digite o nome da conta"
    })
    .then(res => {
        if(!fs.existsSync(`contas/${res.p}.json`)){
            console.log(chalk.red("A conta não existe"))
            deposit()
            return
        }

        const valueBalance = countBalance(res.p)
        const bankCount = res.p

        inquirer.prompt({
            name: "p",
            message: "Qual valor você gostaria de depositar?"
        })
        .then(res => {
            const value = valueDeposit(res.p)
            const finalValue = valueBalance + value
            const valueJSON = JSON.stringify(finalValue)
            fs.writeFileSync(`contas/${bankCount}.json`, `{"balance": ${valueJSON}}`, (error) => {
                console.log(error)
            }) 
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
}

function withdraw(){
    inquirer.prompt({
        name: "p",
        message: "Digite o nome da conta"
    })
    .then(res => {
        if(!fs.existsSync(`contas/${res.p}.json`)){
            console.log(chalk.red("A conta não existe"))
            withdraw()
            return
        }
        const valueBalance = countBalance(res.p)
        const countBank = res.p
        
        inquirer.prompt({
            name: "p",
            message: "Qual valor você deseja sacar?"
        })
        .then(res => {
            const value = parseFloat(res.p)
            if(valueBalance > value) {
            const finalValue = valueBalance - value
            fs.writeFileSync(`contas/${countBank}.json`, `{"Balance": ${JSON.stringify(finalValue)}}`, (error) => {
                console.log(error)
            })
            console.log(`O valor sacado foi de: R$ ${chalk.red(value)
            }`)
            console.log(`O seu saldo é de: R$ ${chalk.green(finalValue)}`)
        
            } else {
                console.log(chalk.red("Você não possui saldo suficiente"))
            }
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))

}

function countBalance(countName){
    const countBalance = fs.readFileSync(`contas/${countName}.json`, {
        encoding: "utf8"
    })
    const countBalanceObj = JSON.parse(countBalance)
    const valueBalance = countBalanceObj.balance
    return valueBalance
}

function valueDeposit(insertValue, countName){
    const value = parseFloat(insertValue)
    return value
    
}