export const extractErrorMessages = (error) => {
    const data = error?.data

    if (Array.isArray(data?.errors)) {
        return data.errors.map((item) => item.message || item).join(', ')
    }

    return data?.message || error?.message || 'Something went wrong'
}
