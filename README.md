# Steam-Readme

This project is designed to provide a dynamic display of a user's Steam gaming status for their GitHub personal profile. It allows others to see what games the user has been playing recently.

## Previews

#### Default

```
/
```

![Preview](https://steam-readme.vercel.app)

#### Dark Theme

```
?theme=dark
```

![Preview](https://steam-readme.vercel.app?theme=dark)

## Deployment

> [!NOTE]
> This will take approximately 5 minutes to set up.

#### 0. Star This Repo (Mandatory) 🌟

- Yes, this step is required.

#### 1. Fork This Repo 🍴

#### 2.Get Steam's ID And API Key 🎮

- STEAM_ID

![](https://images.oathblade.com/images/2024/10/02/cd428b79675bd197765f74365b97538f.webp)

![](https://images.oathblade.com/images/2024/10/02/c6b3df189d3a0c38a49bdaaa17fa72ef.webp)

![](https://static.dingtalk.com/media/lQLPKGmAknBdk7_NBcbNCgCwxHnNLXj9PsgG48FOoJ_5AA_2560_1478.png)

- STEAM_API_KEY

![img](https://static.dingtalk.com/media/lALPM5VwH1V-WKLNBcbNCgA_2560_1478.png)

![img](https://static.dingtalk.com/media/lALPM4rHo2cqED7NBcbNCgA_2560_1478.png)

![img](https://static.dingtalk.com/media/lALPM5yLHJ8LXHnNBcbNCgA_2560_1478.png)

![img](https://static.dingtalk.com/media/lALPM4AfJ3jWhLjNBcbNCgA_2560_1478.png)

![image-20241002202712773](https://images.oathblade.com/images/2024/10/02/9b4b5746e7b3ebc49500b33523816903.webp)

![image-20241002130213271](https://images.oathblade.com/images/2024/10/02/eca3688d3af3ae99df686ac7f2c38f65.webp)

#### 3. Deploy Projects To Vercel 🛠️

- Remember to add environment variables(STEAM_ID and STEAM_API_KEY)

#### 4. Add To Your Github  Readme🚀

```html
<div align="center">
  <a href="https://github.com/KinhoLeung/Steam-Readme">
    <picture>
      <source media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" srcset="https://steam-readme.vercel.app?theme=light" />
      <source media="(prefers-color-scheme: dark)" srcset="https://steam-readme.vercel.app?theme=dark" />
      <img alt="Current Spotify Song" src="https://steam-readme.vercel.app?theme=light" /> 
    </picture>
  </a>
</div>
```

## Note

This project is inspired by the [Spotify-Readme]([KinhoLeung/Spotify-Readme: A dynamic, customizable, and real-time Spotify now-playing widget that seamlessly integrates with your website or GitHub markdown files!](https://github.com/KinhoLeung/Spotify-Readme)), if you want to do secondary development, you can check the steam web api at this [URL](https://steamapi.xpaw.me/#IPlayerService).