import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '../components/layout/Navbar'
import api from '../lib/api/apiClient'
import { extractErrorMessages } from '../util/errorUtils'

export const Profile = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  const user = savedUser ? JSON.parse(savedUser) : null
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch current profile data
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile')
      return response.data.user
    },
    enabled: Boolean(token),
  })

  // Upload profile picture mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.upload('/profile', formData)
      return response.data
    },
    onSuccess: (data) => {
      setError(null)
      setSuccess('Profile picture updated successfully!')
      setSelectedFile(null)
      setPreviewUrl(null)
      refetch() // Refresh profile data
      // Update localStorage user data if needed
      if (data.imageUrl) {
        const updatedUser = { ...user, profile: data.imageUrl }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
      setSuccess(null)
    },
  })

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    uploadMutation.mutate(formData)
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setSuccess(null)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
          <Card className="w-full border-border">
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Log in to view your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full cursor-pointer" onClick={() => navigate('/login')}>
                Go to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentProfile = profileData || user

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and profile picture.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={currentProfile?.username || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentProfile?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <Input
                  value={currentProfile?.createdAt ? new Date(currentProfile.createdAt).toLocaleDateString() : 'N/A'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a new profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Profile Picture */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl || currentProfile?.profile || 'https://res.cloudinary.com/dzj8q4m9c/image/upload/v1700000000/default-profile-picture.png'}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-border"
                  />
                  {previewUrl && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="profile-picture">Choose new picture</Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, JPEG, PNG. Max size: 5MB
                </p>
              </div>

              {/* Upload Actions */}
              {selectedFile && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="flex-1 cursor-pointer"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload Picture'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
