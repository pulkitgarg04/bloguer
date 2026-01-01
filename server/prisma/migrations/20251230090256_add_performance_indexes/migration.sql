-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Post_published_Date_idx" ON "Post"("published", "Date" DESC);

-- CreateIndex
CREATE INDEX "Post_category_published_idx" ON "Post"("category", "published");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_views_idx" ON "Post"("views" DESC);

-- CreateIndex
CREATE INDEX "PostView_postId_idx" ON "PostView"("postId");

-- CreateIndex
CREATE INDEX "PostView_visitorId_idx" ON "PostView"("visitorId");

-- CreateIndex
CREATE INDEX "PostView_postId_visitorId_idx" ON "PostView"("postId", "visitorId");

-- CreateIndex
CREATE INDEX "PostView_postId_createdAt_idx" ON "PostView"("postId", "createdAt");
