package main

import (
	"fmt"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/lucasfloriani/bate-papo-sobre-graphql/graph"
	"github.com/lucasfloriani/bate-papo-sobre-graphql/graph/generated"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: &graph.Resolver{},
			},
		),
	)

	e := echo.New()
	e.Use(middleware.CORS())
	e.GET("/", echo.WrapHandler(playground.Handler("GraphQL playground", "/query")))
	e.POST("/query", echo.WrapHandler(srv))
	e.Start(fmt.Sprintf(":%v", port))
}
