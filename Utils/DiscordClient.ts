import { AttachmentBuilder, Client, Collection, ColorResolvable, EmbedBuilder, SlashCommandBuilder, TextChannel, WebhookClient } from "discord.js";
import { Config } from "./Config";
import { MinecraftClient } from "./MinecraftClient";

// Vibe added made custom properties on the Client which works well... Until I transfered this project to typescript and now no types so this should fix it.
export class DiscordClient extends Client {
    config: Config;
    events: Collection<string, (...args) => Function>;
    commands: Collection<string, Command>;
    cooldowns: string[];
    bot: MinecraftClient;
    webhook: WebhookClient;

    sendWebHookMessage(message: string, picture: string = this.config.constants.defaultProfile, username?: string) {
        this.webhook.send({
            content: message,
            avatarURL: picture,
            username: username,
            allowedMentions: { parse: [ "users" ], users: [] }
        })
    }

    async sendEmbedMessage(location: string, title: string, description: string, picture: string, color: ColorResolvable) {
        //picture = picture || this.config.constants.defaultProfile

        const channel = this.getTextChannel(location)
        const embed = new EmbedBuilder()

        embed.setAuthor({
            name: title,
            iconURL: picture
        })
        embed.setDescription(description)
        embed.setColor(color)
        
        return await channel.send({
            embeds: [ embed ]
        })
    }

    async sendAttachments(location: string, attachments: AttachmentBuilder[]) {
        const channel = this.getTextChannel(location);
        const message = await channel.send({
          files: attachments
        })
        return Array.from(message.attachments.values())
    }

    getTextChannel(id: string) {
        return this.channels.cache.find(c => c.id === id) as TextChannel;
    }
}

type Command = {
    developer?: boolean;
    data: SlashCommandBuilder;
    execute: (...args) => Function;
}

type Event = {
    name: string;
    execute: (interaction: any, client: DiscordClient) => Function;
}