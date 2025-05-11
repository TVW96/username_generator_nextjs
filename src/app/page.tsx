'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createUsername = async (input: string) => {
    setLoading(true);
    try {
      const response = await client.responses.create({
        model: "gpt-4.1",
        input: input,
      });
      console.log("Response:", response);
      const result = response.output_text.split("**").filter(name => name.trim() !== "");
      console.log("Result:", result);
      setUsername(result[1]);
    } catch (error) {
      console.error("OpenAI Error:", error);
      setUsername("Error generating username");
    } finally {
      setLoading(false);
    }
    console.log("Generated username:", username);
    return username;
  }

  // const generateUsername = async () => {
  //   if (!input) return;
  //   setLoading(true);
  //   try {
  //     const response = await openai.createChatCompletion({
  //       model: "gpt-3.5-turbo", // or "gpt-4" if available
  //       messages: [
  //         {
  //           role: "user",
  //           content: `Generate a cool and unique username based on this input: "${input}"`,
  //         },
  //       ],
  //     });

  //     const result = response.data.choices[0].message.content.trim();
  //     setUsername(result);
  //   } catch (error) {
  //     console.error("OpenAI Error:", error);
  //     setUsername("Error generating username");
  //   }
  //   setLoading(false);
  // };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        margin: '20px',
        padding: '10px',
        boxSizing: 'border-box',
        borderRadius: '8px',
        boxShadow: '0 4px 8px 1px rgba(0, 255, 21, 0.54)',
        color: 'black',
      }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Username Generator
      </Typography>
      <TextField
        label="Enter your name"
        variant="outlined"
        id="username-input"
        sx={{ marginBottom: '20px', width: '300px' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => createUsername(input)}
        disabled={loading}
        sx={{ marginTop: '20px' }}
      >
        Generate
      </Button>
      <Typography variant="h5" component="h2" sx={{ marginTop: '20px' }}>
        {loading ? "Generating..." : username ? `Generated Username: \n ${username}` : ""}
      </Typography>
    </Box>
  );
}
