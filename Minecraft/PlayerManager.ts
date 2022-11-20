import { DrippyBlockClient } from "../Utils/DrippyBlockClient";
import { DrippyClient } from "../Utils/DrippyClient";
import { Player } from "./Player";

export class PlayerManager {
    public packetName: string;
    private bot: DrippyBlockClient;
    private players: Map<string, Player>

    constructor(client: DrippyBlockClient) {
        this.bot = client;
        this.players = new Map();

        this.bot.on('player_info', (packet) => {
            const { data } = packet;
            switch(packet.action) {
                case 0:
                    const player = new Player(data[0]?.name, data[0]?.uuid)
                    this.players.set(data[0]?.UUID, player)
                    player.downloadImage();
                    break;
                case 4:
                    this.players.delete(data[0]?.UUID)
                    break;
            }
        })
    }

    getPlayers() {
        return this.players;
    }

    getPlayerArray() {
        return Array.from(this.getPlayers().values());
    }
}