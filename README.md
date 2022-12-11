# Vultr Private VDI 
- Vultr VDI with Terraform
<img width="288" alt="image" src="https://user-images.githubusercontent.com/3627483/205460464-0c65c0b8-5528-4d75-9558-fb275029cd53.png">
<img src="https://user-images.githubusercontent.com/3627483/205460512-2786d59d-70dc-43ca-b445-44b2a6080df6.png">
<img src="https://user-images.githubusercontent.com/3627483/205460761-4c32191d-d4f8-47fa-9b66-1324cd79b970.png">
<img src="https://user-images.githubusercontent.com/3627483/205460949-f4799c63-e4b7-4492-a3d8-083379db9026.png">
<img width="253" alt="image" src="https://user-images.githubusercontent.com/3627483/205461597-440dad80-4bba-4506-b813-9e40563ec3b6.png">
<img width="1256" alt="image" src="https://user-images.githubusercontent.com/3627483/205461588-d67e1c69-57c0-4dbf-8521-76e63fa8c8d8.png">
- 슬랙에서 서버생성 내리면, 슬랙 Bot 기능을 통해 CloudFlare Worker 서버로 요청하고, Worker 서버는 Github Action API를 호출해서 Terraform Apply 작업을 수행하여 Vultr VDI를 하나 만들어줍니다. 
- VDI는 가상 데스크탑 환경이며, Vultr 클라우드 VM을 사용하여 가상 데스크톱을 제공하고 관리하는 가상화 솔루션입니다. VDI는 중앙 집중식 서버에서 데스크톱 환경을 호스팅하여 요청 시 최종 사용자에게 배포합니다.  

# Requirements
- CloudFlare Account - CloudFlare Worker(Wrangler) for Slackbot
- AWS Account(S3) - Terraform state management, `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET_KEY`
- Vultr Account - API Key
- Vultr Snapshot ID
- Vultr BlockStorage ID 
- Slack Account - Slack Bot - 봇, Hook URL 필요
- Github Action (Github API) - Github Person Access Token

# Cost
- Vultr 클라우드 비용, Snapshot, Blockstorage 비용이 부과됩니다. 
- Terraform State 관리에 필요한 S3 비용이 약간 나올 수 있습니다.

# Cloudflare worker 배포
```
git clone https://github.com/kimjayney/vultr_vdi
```
```
cd slackbot
```
```
npx wrangler publish
```

# AWS S3 설정
- vultr-vdi bucket을 생성해주세요.

# Slack 설정
-  wrangler 주소쪽으로 향하게 설정해 줍니다. 아래 이미지를 참고하세요. 채팅 메세지가 보내질 때 마다 Slack 서버가 wrangler worker 주소쪽으로 POST 요청을 보냅니다. 
- https://imgur.com/a/UnfxhYF

# 슬랙봇 작동 확인
- `@ServerBot 서버생성/vhf-4c-16gb/사양` - 서버를 생성하는 명령어 입니다. Github Action API를 호출하며, Terraform 으로 수행합니다.
- `@ServerBot 서버삭제` - 서버를 삭제하는 명령어입니다. Github Action API를 호출하며, Terraform 으로 수행합니다.

# Github Action secret 설정
- AWS_ACCESS_KEY_ID
- AWS_ACCESS_SECRET_KEY - AWS IAM 시크릿 값으로 Github Action이 S3에 접속하여 State를 유지합니다.
- CF_WORKER_URL - Cloudflare worker 배포 시 나오는 주소를 입력합니다. 
- SLACK_WEBHOOK_URL

# Cloudflare Worker 시크릿 설정
```
npx wrangler secret put BLOCKSTORAGE_ID
npx wrangler secret put GIT_PAT
npx wrangler secret put GITHUB_ACTION_DEPLOY_YAML_URL	
npx wrangler secret put GITHUB_ACTION_DESTROY_YAML_URL	
npx wrangler secret put SLACK_WEBHOOK_URL
npx wrangler secret put SNAPSHOT_ID
npx wrangler secret put VULTR_API_KEY
```
# 사용 방법
- `@ServerBot 서버생성/vhf-4c-16gb/사양` - 서버를 생성하는 명령어 입니다. Github Action API를 호출하며, Terraform 으로 수행합니다.
- `@ServerBot 서버삭제` - 서버를 삭제하는 명령어입니다. Github Action API를 호출하며, Terraform 으로 수행합니다.


# 개발 시 참고한 링크
- https://www.netapp.com/ko/virtual-desktop-infrastructure/what-is-virtual-desktop-infrastructure/
- https://developers.cloudflare.com/workers/tutorials/build-a-slackbot/

# Todo
- AWS Spot GPU Instance with Terraform
- Linode Terraform 
- GCP Terraform
- Conoha Terraform
