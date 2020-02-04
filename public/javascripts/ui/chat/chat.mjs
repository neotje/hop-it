import * as socket from "./chatSocket.mjs";

export class chatManager {
    constructor(elem) {
        this._elem = elem;
        this._list = elem.find('.chat__list');
        this._input = elem.find('.chat__room__input')
        this._form = elem.find('.chat__room__input-bar')
        this.userUUID = elem.attr('uuid');
        this.BulletinManager = document.querySelector('.bulletin_list').BulletinManager;

        this._list.find('.chat__list-item').click((e) => {
            var $item = $(e.currentTarget);
            this.open($item.attr('uuid'))
        });

        this._form.submit((e) => {
            e.preventDefault();
            if (this._input.val().trim() != '') {
                socket.send(this.activeChat(), this._input.val().trim());
                this._input.val('');
            }
        });

        this._input.keydown((e) => {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
                this._form.submit();
            }
        });

        this._input.keyup(() => {
            var rows = this._input.val().split(/\r\n|\r|\n/).length;
            var maxRows = 6

            if (rows <= maxRows) {
                this._input.attr('rows', rows);
            }
        });

        for (const item of this._list.find('.chat__list-item')) {
            var $item = $(item)

            socket.onRecieveMessage($item.attr('uuid'), (chat) => {
                this.genChatMessageHistory(chat.uuid);
                if (chat.last && (this.activeChat() != chat.uuid) && (chat.last.sender.uuid != this.userUUID)) {
                    console.log("sending notification");

                    this.BulletinManager.add('info', chat.last.sender.name, chat.last.content);
                }

                this._list.find('.chat__list-item[uuid="' + chat.uuid + '"] .chat__list-item__content .chat__list-item__last-message').text(chat.last.content);
            });
        }

        socket.getIO().emit('resendMessageList');
    }

    activeChat() {
        return this._list.find('.chat__list-item[active="true"]').attr('uuid');
    }

    open(uuid) {
        this._list.find('.chat__list-item').attr('active', 'false');
        this._list.find('.chat__list-item[uuid="' + uuid + '"]').attr('active', 'true');

        this._elem.find('.chat__room .chat__room__messages').attr('active', 'false');
        this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]').attr('active', 'true')

        this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]').scrollTop(this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]').height())
    }

    genChatMessageHistory(uuid) {
        var chat = socket.getChat(uuid);
        var room = this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]')

        room.html('');

        for (const uuid in chat.messages) {
            const message = chat.messages[uuid];

            var date = new Date(message.date).toLocaleTimeString([], { hourCycle: 'h24', timeStyle: 'short' });


            var msgElem = $(`
            <div class="chat__room__message" from="">
                <div class="chat__room__message-content">
                    <p class="chat__room__message-text">${message.content}</p>
                    <p class="chat__room__message-time">${date}</p>
                </div>
            </div>
            `);

            if (message.sender.uuid == this.userUUID) {
                msgElem.attr('from', 'me');
            }

            room.append(msgElem);
        }
        this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]').scrollTop(this._elem.find('.chat__room .chat__room__messages[uuid="' + uuid + '"]').height())

    }
}