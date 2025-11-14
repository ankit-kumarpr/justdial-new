
'use client';

import { Business } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Globe, Star, MessageSquare, Share2, Heart, Package, Facebook, Instagram, Twitter, Linkedin, Youtube, Play, FileText } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RestaurantGallery } from './restaurant-gallery';

interface BusinessProfileDetailsProps {
  business: Business;
}

export function BusinessProfileDetails({ business }: BusinessProfileDetailsProps) {
  const name = business.businessName || business.name;
  const address = business.businessAddress || business.address;
  const phone = business.mobileNumber || business.phone;
  const rating = business.rating || 0;
  
  const galleryImages = business.businessPhotos?.map(p => p.url).filter(Boolean) || [];
  const videoUrl = business.businessVideo?.url || null;

  return (
    <div className="space-y-6">
      {galleryImages.length > 0 && <RestaurantGallery business={{...business, gallery: galleryImages }} />}
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Business Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="business-name">{name}</h1>
                  {business.matchedKeywords && business.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {business.matchedKeywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{business.reviews?.length || 0} Ratings</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{address}</p>
                    </div>
                  )}
                  
                  {business.city && business.state && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">
                        {business.city}, {business.state} {business.pincode && `- ${business.pincode}`}
                      </p>
                    </div>
                  )}

                  {business.distanceKm && (
                    <div className="text-sm text-muted-foreground">
                      📍 {business.distanceKm} km away
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {phone && (
                    <Button className="bg-green-600 hover:bg-green-700" data-testid="call-button">
                      <Phone className="mr-2 h-4 w-4" />
                      Call: {phone}
                    </Button>
                  )}
                  <Button variant="outline" data-testid="enquiry-button">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Enquiry
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>
            )}
            {business.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{business.email}</p>
                </div>
              </div>
            )}
            {business.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              </div>
            )}
            {business.gstNumber && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <p className="font-medium">{business.gstNumber}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Services Section */}
      {business.services && business.services.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Services Offered ({business.totalServices || business.services.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {business.services.map((service, index) => (
                  <div key={service._id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`service-${index}`}>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Service Image */}
                      {service.serviceImage && (
                        <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={service.serviceImage.startsWith('http') ? service.serviceImage : `${process.env.NEXT_PUBLIC_API_BASE_URL}${service.serviceImage}`}
                            alt={service.serviceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{service.serviceName}</h3>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        )}
                        
                        {/* Pricing Information */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          {service.priceType === 'single' && (
                            <>
                              {service.discountPrice && (
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-green-600">
                                    ₹{service.discountPrice}
                                  </span>
                                  {service.actualPrice && service.actualPrice !== service.discountPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₹{service.actualPrice}
                                    </span>
                                  )}
                                </div>
                              )}
                              {!service.discountPrice && service.actualPrice && (
                                <span className="text-2xl font-bold">₹{service.actualPrice}</span>
                              )}
                            </>
                          )}
                          
                          {service.priceType === 'range' && (
                            <div className="text-lg font-semibold">
                              ₹{service.minPrice} - ₹{service.maxPrice}
                            </div>
                          )}
                          
                          {service.unit && (
                            <Badge variant="outline">{service.unit}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Business Video */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Business Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <video 
                  controls 
                  className="w-full h-full"
                  data-testid="business-video"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social Media Links */}
      {business.socialMediaLinks && Object.values(business.socialMediaLinks).some(link => !!link) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {business.socialMediaLinks.facebook && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(business.socialMediaLinks?.facebook, '_blank')}
                    data-testid="facebook-link"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                )}
                {business.socialMediaLinks.instagram && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(business.socialMediaLinks?.instagram, '_blank')}
                    data-testid="instagram-link"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                )}
                {business.socialMediaLinks.twitter && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(business.socialMediaLinks?.twitter, '_blank')}
                    data-testid="twitter-link"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                )}
                {business.socialMediaLinks.linkedin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(business.socialMediaLinks?.linkedin, '_blank')}
                    data-testid="linkedin-link"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {business.socialMediaLinks.youtube && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(business.socialMediaLinks?.youtube, '_blank')}
                    data-testid="youtube-link"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Vendor Information */}
      {business.vendor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Business Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-lg">{business.vendor.name}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>📧 {business.vendor.email}</p>
                  <p>📱 {business.vendor.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
