output "ec2_public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.main.public_ip
}

output "eks_cluster_name" {
  description = "Name of EKS cluster"
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "Endpoint of EKS cluster"
  value       = aws_eks_cluster.main.endpoint
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

