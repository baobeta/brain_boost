package controllers

import (
	"net/http"

	"github.com/baolequoc/Flashcard-system/server/pkg/backend/services"
	"github.com/gin-gonic/gin"
)

type CardController struct {
    Service *services.CardService
}

func (c *CardController) GetDueCards(ctx *gin.Context) {
    cards, err := c.Service.GetCardsToLearnToday()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, cards)
}

func (c *CardController) AddCard(ctx *gin.Context) {
    var request struct {
        Question string `json:"question"`
        Answer   string `json:"answer"`
    }
    if err := ctx.ShouldBindJSON(&request); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    err := c.Service.AddCard(request.Question, request.Answer)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusCreated, gin.H{"message": "Card added successfully"})
}

func (c *CardController) ScheduleCard(ctx *gin.Context) {
    var request struct {
        CardID  uint `json:"card_id"`
        Quality int  `json:"quality"`
    }
    if err := ctx.ShouldBindJSON(&request); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    err := c.Service.ScheduleCard(request.CardID, request.Quality)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{"message": "Card scheduled successfully"})
}