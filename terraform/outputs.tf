output "s3_bucket_name" {
  value = aws_s3_bucket.react_microfrontend.bucket
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.react_cdn.domain_name
}
