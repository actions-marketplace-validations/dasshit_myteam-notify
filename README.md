# myteam-notify javascript action

Fast way to send notification via ICQ/Myteam Bot API

## Inputs

## `api-url`

**Required** 
Bot API URL (ICQ/Myteam). 
Default `"World"`.

## `bot-token`

**Required**
Bot token.

## `chat-id`

**Required**
Notification chat ID (or stamp from chat URL).

## `msg-text`

Notification text

## `parseMode`

Msg text formatting mode

## Outputs

## `result`

Result of sending notification

## Example usage

```on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: Testing notify
    steps:
      - name: Hello world action step
        id: hello
        uses: dasshit/myteam-notify@v3.3
        with:
          api-url: ${{ secrets.BOTAPI }}
          bot-token: ${{ secrets.BOTTOKEN }}
          chat-id: ${{ secrets.CHATID }}
      # Use the output from the `hello` step
      - name: Get the output result
        run: echo "The time was ${{ steps.hello.outputs.result }}"```
