variable "api_key" {
    type = string
}
variable "snapshot_id" {
    type = string
    default = "snapshot_id"
}

variable "plan" {
    type = string
    default = "vhf-1c-1gb"
}

variable "region" {
    type = string
    default = "icn"
}

terraform {
  backend "s3" {
    bucket         = "vultr-vdi"
    key            = "dev/terraform.tfstate"
    region         = "ap-northeast-2"
  }
  required_providers {
    vultr = {
      source = "vultr/vultr"
      version = "2.11.4"
    }
  }
}

provider "vultr" {
  api_key = var.api_key
  rate_limit = 700
  retry_limit = 3
}

#Create Vultr VDI
resource "vultr_instance" "vdi" {
    enable_ipv6 = true
    plan = var.plan
    region = var.region
    snapshot_id = var.snapshot_id
    backups = "disabled"
    ddos_protection = false
    activation_email = false
}

output "vdi_ip" {
    value = vultr_instance.vdi.main_ip
}

output "instance_id" {
    value = vultr_instance.vdi.id
}
