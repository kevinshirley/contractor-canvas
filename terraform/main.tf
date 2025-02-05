provider "aws" {
  region = "us-east-1"
}

# S3 Bucket (React Microfrontend)
resource "aws_s3_bucket" "react_microfrontend" {
  bucket = "react-microfrontend-bucket-${random_id.bucket_suffix.hex}"
  force_destroy = true
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Disable Block Public Access (Fix for Access Denied)
resource "aws_s3_bucket_public_access_block" "react_microfrontend_block" {
  bucket                  = aws_s3_bucket.react_microfrontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Create CloudFront Origin Access Identity (OAI) to Securely Access S3
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for CloudFront to access S3 bucket securely"
}

# Apply an S3 Bucket Policy to Allow Only CloudFront OAI to Read Files
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.react_microfrontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAI"
      Effect    = "Allow"
      Principal = {
        AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
      }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.react_microfrontend.arn}/*"
    }]
  })
}

resource "aws_cloudfront_distribution" "react_cdn" {
  origin {
    domain_name = aws_s3_bucket.react_microfrontend.bucket_regional_domain_name
    origin_id   = "S3Origin"

    # Secure Access: Restrict CloudFront to Use OAI for S3 Access
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  # Default Cache Behavior
  default_cache_behavior {
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 3600
    default_ttl = 86400
    max_ttl     = 31536000
  }

  # 🔹 Required Restrictions Block (Fix for Terraform Error)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Viewer Certificate (HTTPS)
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
