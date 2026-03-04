package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomString(nBytes int) string {
	b := make([]byte, nBytes)
	rand.Read(b)
	return hex.EncodeToString(b)
}
