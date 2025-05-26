"use server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL ?? "envNotFound",
  process.env.SUPABASE_ANON_KEY ?? "envNotFound",
);

export async function writeScore(username: string, score: number) {
  const { data, error } = await supabase
    .from("leaderboard")
    .select()
    .eq("username", username);

  if (error != null) {
    console.log("failed to fetch leaderboard data error=%s", error);
    return;
  }

  if (
    data != null &&
    data.length >= 1 &&
    Math.max(...data.map((e) => e.score)) < score
  ) {
    const old_score = Math.max(...data.map((e) => e.score));
    console.log(
      "User found, updating... username=%s old_score=%s new_score=%s",
      username,
      old_score,
      score,
    );
    const res = await supabase
      .from("leaderboard")
      .update({ username: username, score: score })
      .eq("username", username);
    console.log("Updated status=%s", res);
  } else if (data == null || data.length == 0) {
    console.log(
      "User not found, inserting... username=%s score=%s",
      username,
      score,
    );
    const res = await supabase
      .from("leaderboard")
      .insert({ username: username, score: score });
    console.log("Inserted status=%s", res);
  } else {
    console.log("Skipping write");
  }
}

export async function fetchAllScores(): Promise<
  {
    created_at: string;
    id: string;
    score: number;
    username: string;
  }[]
> {
  const { data, error } = await supabase.from("leaderboard").select();

  if (error != null) {
    console.log("failed to fetch leaderboard data error=%s", error);
    return [];
  }
  return data ?? [];
}
