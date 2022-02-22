import { context } from "@actions/github";
import fetch from "node-fetch";
import { getInput, setOutput } from "@actions/core";
import { stringify } from "yaml"
import { FormData, File } from "formdata-node";
import { statSync, readdirSync, readFileSync } from "fs";
import { basename } from "path";

function assembleMsg(github) {

    let newMsgText = `<code><a href="${github.sender.html_url}">${github.sender.login}</a> did some changes in repository:\n\n`

    newMsgText += stringify(github.commits)

    newMsgText += '</code>'

    return newMsgText
}


function createUrlWithParams(apiUrl: string, params: Object) : URL {

    let url = new URL(`${getInput('api-url', {})}/messages/sendText`)

    Object.keys(params).forEach(
        key => {
            console.log(`${key} => ${params[key]}`)
            url.searchParams.append(key, params[key])
        }
    )

    return url

}


function getFiles (dir, files_?){
    files_ = files_ || [];
    let files = readdirSync(dir);
    for (let i in files){
        let name = dir + '/' + files[i];
        if (statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


function sendMsg (url: URL, form?: FormData) {



    console.log(`URL: ${url}`)

    fetch(
        url.toString()
    ).then(res => res.text())
        .then(
            text => {
                console.log(text)
                setOutput("result", text)
            }
        )
}


export function sendTextMsg() {


    sendMsg(
        createUrlWithParams(
            `${getInput('api-url', {})}/messages/sendText`,
            {
                token: getInput('bot-token', {}),
                chatId: getInput('chat-id', {}),
                text: getInput('msg-text', {}) || assembleMsg(context.payload),
                parseMode: getInput('parseMode', {})
            }
        )
    )

}

export function sendFilesMsg(path: string) {

    for (let file of getFiles(path)) {

        let form = new FormData();

        form.append(
            "file", new File(
                readFileSync(file), basename(file)
            )
        )

        sendMsg(
            createUrlWithParams(
                `${getInput('api-url', {})}/messages/sendFile`,
                {
                    token: getInput('bot-token', {}),
                    chatId: getInput('chat-id', {}),
                }
            ),
            form
        )

    }

}